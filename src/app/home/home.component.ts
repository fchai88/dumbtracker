import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { UserDetail } from '../models/user-detail.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User;
  userDetail: UserDetail;
  private userDetailSub: Subscription;

  constructor(private authService: AuthService) {
   }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authService.getUserInfo(this.user.localId);
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
