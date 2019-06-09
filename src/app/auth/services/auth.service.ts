//NOTE: This approach is for the more common way with connecting to REST API's

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Demographics, UserDetail } from 'src/app/models/user-detail.model';
import { stringify } from '@angular/core/src/render3/util';

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
  userChanged = new Subject<User>();
  private user: User;
  userDetailChanged = new Subject<UserDetail>();
  private userDetail: UserDetail;

  constructor(private http: HttpClient) { }

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

  getUserInfo(userId: string) {
    this.http.get<{ [key: string]: UserDetail }>
      ('https://dumbtracker.firebaseio.com/user-detail.json?orderBy="userId"&equalTo="' + userId + '"')
        .pipe(
          map(res => {
            for(const key in res) {
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

  private handleAuthentication(email: string, userId: string, expiresIn: number, token: string) {
    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    this.user = new User(email, userId, token, expirationDate);
    this.userChanged.next(this.user);
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

  getUser() {
    return this.user;
  }
}
