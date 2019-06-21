//NOTE: This approach is for the more common way with connecting to REST API's

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Demographics, UserDetail } from 'src/app/models/user-detail.model';
import { Router } from '@angular/router';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userChanged = new BehaviorSubject<User>(null);
  private user: User;
  userDetailChanged = new Subject<UserDetail>();
  private userDetail: UserDetail;
  private tokenExpTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBTL4mqEaThfvMKdZroTikj2L0iQV77gW0',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, +resData.expiresIn, resData.idToken);
        })
      );
  }

  emailSignin(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBTL4mqEaThfvMKdZroTikj2L0iQV77gW0',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, +resData.expiresIn, resData.idToken);
        })
      );
  }

  saveUserInfo(userId: string, displayName: string, demographics: Demographics, goals: string) {
    this.userDetail = new UserDetail(userId, displayName, demographics, goals);
    return this.http.post<UserDetail>('https://dumbtracker.firebaseio.com/user-detail.json', this.userDetail);
  }

  getUserInfo() {
    this.http.get<{ [key: string]: UserDetail }>
      ('https://dumbtracker.firebaseio.com/user-detail.json?orderBy="userId"&equalTo="' + this.user.localId + '"')
      .pipe(
        map(res => {
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              return res[key];
            }
          }
        })
      ).subscribe(
        res => {
          console.log("THIS IS IN SUBSCRIBE:", res);
          this.userDetail = res;
          this.userDetailChanged.next(this.userDetail);
        }, err => {
          console.log(err);
        }
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      localId: string;
      _token: string;
      _tokenExpDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email, 
      userData.localId, 
      userData._token, 
      new Date(userData._tokenExpDate)
    );

    if (loadedUser.token) {
      this.user = loadedUser;
      this.userChanged.next(this.user);
      const expDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime()
      this.autoLogout(expDuration);
    }
  }

  logout() {
    this.user = null;
    this.userDetail = null;
    this.userChanged.next(this.user);
    this.userDetailChanged.next(this.userDetail);
    this.router.navigate(['/auth/signin']);
    localStorage.removeItem('userData');
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    this.tokenExpTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpTimer = setTimeout(() => {
      console.log('AUTO LOGGED OUT');
      this.logout();
    }, expirationDuration)
  }

  private handleAuthentication(email: string, userId: string, expiresIn: number, token: string) {
    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    this.user = new User(email, userId, token, expirationDate);
    this.userChanged.next(this.user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(this.user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error has occured.';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    } else {
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists.';
          break;
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
          errorMessage = 'Email or password does not match.';
      }
      return throwError(errorMessage);
    }
  }
}
