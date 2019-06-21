import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.scss']
})
export class WorkoutsComponent implements OnInit {
  isAWorkoutSelected: boolean = false;
  isExpandNewWorkout: boolean = false;
  workouts = [
    {
      'id': '',
      'name': 'Chest Day',
      'description': 'This is a my typical chest workout',
      'isActive': false
    },
    {
      'id': '',
      'name': 'Leg Day',
      'description': 'The best leg workout. When Im feeling like an extra strong pump',
      'isActive': false
    },
    {
      'id': '',
      'name': 'Cardio',
      'description': '',
      'isActive': false
    },
    {
      'id': '',
      'name': 'Bis/Tris',
      'description': 'Mixing both biceps and triceps',
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
        element.isActive = element.isActive ? false : true;
      } else {
        element.isActive = false;
      }
    }
  }

  onDeleteWorkout(index: number) {
    this.workouts.splice(index, 1);
  }
}
