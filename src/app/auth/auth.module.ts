import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        AuthComponent,
        SignupComponent,
        SigninComponent,
    ],
    imports: [
        SharedModule, FormsModule, ReactiveFormsModule, RouterModule, AuthRoutingModule,
    ]
})
export class AuthModule {

}