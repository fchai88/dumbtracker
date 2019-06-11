import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserDetail } from 'src/app/models/user-detail.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userDetail: UserDetail;
  private userDetailSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
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
    this.authService.logout();
  }

}