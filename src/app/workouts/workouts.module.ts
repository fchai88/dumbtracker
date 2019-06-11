import { NgModule } from '@angular/core';

import { WorkoutsComponent } from './workouts.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        WorkoutsComponent
     ],
    imports: [
        SharedModule
     ],
    exports: [
         WorkoutsComponent
     ]
})
export class WorkoutsModule {}