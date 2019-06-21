import { NgModule } from '@angular/core';

import { WorkoutsComponent } from '../workouts/workouts.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { NavbarComponent } from '../common/navbar/navbar.component';

@NgModule({
    declarations: [
        HomeComponent,
        NavbarComponent,
        WorkoutsComponent
     ],
    imports: [
        SharedModule
     ]
})
export class HomeModule {}