import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Box } from 'src/app/core/models/SavingBox';
import { Observable, Subject, debounce, interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent {
  @Input() box: Box = {
    id: '',
    owner: '',
    type: 'box',
    title: ''
  };
  @Input() selected = false;
  @Output() select = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(private router: Router) {}

  open() {
    this.select.emit();
  }

  close() {
    setTimeout(() => {
      this.select.emit();
    });
  }

  editTitle() {
    this.edit.next(this.box);
  }

  deleteBox() {
    this.delete.emit();
  }

  openBox() {
    this.router.navigate(['/boxes', this.box.id]);
  }
}
