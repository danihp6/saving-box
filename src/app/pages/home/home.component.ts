import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SavingBox } from 'src/app/core/models/SavingBox';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  savings = 0;
  boxes: SavingBox[] = [
    {
      type: 'box',
      title: 'Piso',
      savings: 0,
      incomings: 0
    }
  ];
  selectedBox?: number;

  constructor(private router: Router) {};

  selectBox(index: number) {
    if (this.selectedBox === undefined) {
      this.selectedBox = index;
    } else {
      this.selectedBox = undefined;
    }
    console.log(this.selectedBox)
  }

  addBox() {
    this.boxes.push({
      type: 'box',
      title: 'Box',
      savings: 0,
      incomings: 0
    });
  }
}
