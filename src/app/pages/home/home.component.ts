import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Box } from 'src/app/core/models/SavingBox';
import { BoxesService } from 'src/app/core/services/boxes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  savings = 0;
  incomings = 0;
  boxes: Box[] = [];
  selectedBox?: number;

  constructor(private router: Router, private boxesService: BoxesService) {
    this.boxesService.getBoxes().subscribe({
      next: response => {
        this.boxes = response.boxes;
        this.savings = this.boxes.map(box => box.savings ?? 0).reduce(
          (prev, next) => prev + next
        );
        this.incomings = this.boxes.map(box => box.incomings ?? 0).reduce(
          (prev, next) => prev + next
        );
      }
    });
  }

  selectBox(index: number) {
    if (this.selectedBox === undefined) {
      this.selectedBox = index;
    } else {
      this.selectedBox = undefined;
    }
  }

  addBox() {
    this.boxesService.addBox({
      owner: 'test',
      title: 'Box',
      type: 'box'
    }).subscribe({
      next: response => {
        this.boxes.push(response.box);
      }
    });
  }

  deleteBox(index: number, box: Box) {
    this.boxesService.deleteBox(box.id, box.owner).subscribe({
      next: () => {
        this.boxes.splice(index, 1);
        delete this.selectedBox;
      }
    });
  }

  editBox(index: number, box: Box) {
    this.boxesService.editBox(box).subscribe({
      next: response => {
        this.boxes[index] = response.box;
      }
    });
  }
}
