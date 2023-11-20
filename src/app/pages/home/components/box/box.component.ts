import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SavingBox } from 'src/app/core/models/SavingBox';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent {
  @Input() box: SavingBox = {
    type: 'box',
    title: '',
    savings: 0,
    incomings: 0
  };
  @Input() selected = false;
  @Output() select = new EventEmitter();
  editing = false;

  open() {
    this.select.emit();
  }

  close() {
    setTimeout(() => {
      this.select.emit();
    });
  }
}
