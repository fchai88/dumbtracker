import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  today: Date = new Date();
  submitted: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;


  email: string;
  password: string;

  login(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.isLoading = true;
      this.authService.emailSignin(this.email, this.password)
        .subscribe(
          res => {
            this.isLoading = false;
            console.log(res);
            this.errorMessage = '';
            this.router.navigate(['/home']);
          }, err => { //error handling is be done in service so component is much leaner
            form.reset();
            this.isLoading = false;
            this.submitted = false;
            console.log(err);
            this.errorMessage = err;
          }
        );
    }
  }

  onCloseErrorModal() {
    this.errorMessage = "";
  }

}
