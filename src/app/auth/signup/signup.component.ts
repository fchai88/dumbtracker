import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignupValidators } from './signup.validators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Demographics } from 'src/app/models/user-detail.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  singupForm: FormGroup;
  fitnessOtherSelected: boolean  = false;
  submitted: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    //Note: replace 'null' in FormControl.formState for each control with data from DB if needed to prepopulate data

    this.singupForm = new FormGroup({
      'displayName': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'confirmEmail': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]),
      'confirmPassword': new FormControl(null, [Validators.required]),
      'gender': new FormControl(null, [Validators.required]),
      'weight': new FormControl(null, [Validators.required]),
      'heightFt': new FormControl('', [Validators.required]),
      'heightIn': new FormControl('', [Validators.required]),
      'fitnessGoal': new FormControl(null, [Validators.required]),
      'fitnessGoalOther': new FormControl(null)
    }, { validators: [
        //Alternatviely I could have grouped each "matching" control and have the validations just check the individual 
        //groups
        SignupValidators.emailFieldsMustMatch, 
        SignupValidators.passwordFieldsMustMatch,
        SignupValidators.fitnessGoalOtherEmpty
        ]
      })
  }

  otherFitnessChanged(didSelect: boolean) {
    if (didSelect) {
      this.fitnessOtherSelected = true;
    } else {
      this.fitnessOtherSelected = false;
      this.FitnessGoalOther.setValue(null);
    }
  }

  onSignup() {
    this.submitted = true;
    if (this.singupForm.valid) {
      this.isLoading = true;
      this.authService.registerUser(this.Email.value, this.Password.value)
        .subscribe(
          res => {
            console.log(res);
            this.errorMessage = '';
            const userDemographics: Demographics = {
              weight: this.Weight.value, 
              heightFt: this.HeightFt.value, 
              heightIn: this.HeightIn.value
            };
            const userGoals: string = this.FitnessGoalOther.value ? this.FitnessGoal.value + ": " + this.FitnessGoalOther.value : this.FitnessGoal.value;
            this.authService.saveUserInfo(
              res.localId, 
              this.DisplayName.value, 
              userDemographics,
              userGoals).subscribe(
                res => {
                  this.isLoading = false;
                  this.authService.userDetailChanged.next(res);
                  this.router.navigate(['/home']);
                }
              );
          }, err => { //error handling is be done in service (catchError() pipe with throwError()) so component is much leaner
            this.isLoading = false;
            console.log(err);
            this.errorMessage = err;
          }
        );
    }
  }

  //use getters for easier access (specifically for html) to form controls
  //espeically use if you have nested form groups
  //probably not needed for very small forms
  public get DisplayName() {
    return this.singupForm.get('displayName');
  }
  public get Email() {
    return this.singupForm.get('email');
  }
  public get ConfirmEmail() {
    return this.singupForm.get('confirmEmail');
  }
  public get Password() {
    return this.singupForm.get('password');
  }
  public get ConfirmPassword() {
    return this.singupForm.get('confirmPassword');
  }
  public get Gender() {
    return this.singupForm.get('gender');
  }
  public get Weight() {
    return this.singupForm.get('weight');
  }
  public get HeightFt() {
    return this.singupForm.get('heightFt');
  }
  public get HeightIn() {
    return this.singupForm.get('heightIn');
  }
  public get FitnessGoal() {
    return this.singupForm.get('fitnessGoal');
  }
  public get FitnessGoalOther() {
    return this.singupForm.get('fitnessGoalOther');
  }
}
