import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.scss']
})
export class WorkoutsComponent implements OnInit {
  isAWorkoutSelected: boolean = false;
  workouts = [
    {
      'name': 'Chest Day',
      'isActive': false
    },
    {
      'name': 'Leg Day',
      'isActive': false
    },
    {
      'name': 'Cardio',
      'isActive': false
    },
    {
      'name': 'Bis/Tris',
      'isActive': false
    },];


  constructor() { }

  ngOnInit() {
  }

  activateClass(index: number) {
    // this.workouts[index].isActive = !this.workouts[index].isActive;
    for (let i = 0; i < this.workouts.length; i++) {
      const element = this.workouts[i];
      if (index == i) {
        element.isActive = true;
      } else {
        element.isActive = false;
      }
    }
  }
}
