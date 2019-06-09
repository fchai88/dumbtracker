import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  title = 'dumbtracker';

  constructor(private authService: AuthService, private router: Router) {  }

  ngOnInit() {
  }
}
