import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Subscription } from 'rxjs';
import { UserDetail } from '../models/user-detail.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  userDetail: UserDetail;
  private userDetailSub: Subscription;

  constructor(private authService: AuthService) {
   }

  ngOnInit() {
    //obsolete code now that we are using BehaviorSubjects
    // this.authService.userChanged.pipe(take(1)).subscribe(  //take() oerator allows you to get x number of values from subscription then auto unsubs
    //   res => {
    //     this.user = res;
    //     console.log(this.user);
    //     this.authService.getUserInfo(this.user.localId);
    //   }
    // );
    this.authService.getUserInfo();
    this.userDetailSub = this.authService.userDetailChanged.subscribe(
      res => {
        this.userDetail = res;
      }
    )
  }

  ngOnDestroy() {
    this.userDetailSub.unsubscribe();
  }

  signOut() {
  }

}
