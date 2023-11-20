import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SavingBox } from 'src/app/core/models/SavingBox';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent {
  @ViewChild('list') list!: ElementRef<HTMLDivElement>;
  box: SavingBox = {
    title: 'Piso',
    type: 'box',
    savings: 0,
    incomings: 0
  };
  items: {
    name: string;
    amount: number;
  }[] = [
    {
      name: 'Rumba',
      amount: 100
    }
  ];
  purchased: {
    name: string;
    amount: number;
  }[] = [];
  financesOpened = false;
  transactionValue = 0;
  mode: 'items' | 'history' = 'items';
  dragging = false;

  constructor(private router: Router) {}


  newItem() {
    this.items.push({
      amount: 0,
      name: 'item'
    });
    this.scrollList();
  }

  openfinances() {
    this.financesOpened = !this.financesOpened;
  }

  transaction(op: '+' | '-') {
    switch(op) {
      case '+':
        this.box.savings += this.transactionValue;
        break;
      case '-':
        this.box.savings -= this.transactionValue;
        break;
    }
  }

  drop(event: any) {
    if (event.container.id === event.previousContainer.id) {
      moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    } else {
      switch (event.container.id) {
        case 'delete':
          this.items.splice(event.previousIndex, 1)
          break;
        case 'purchased':
          transferArrayItem(
            this.items,
            this.purchased,
            event.previousIndex,
            event.currentIndex
          );
          console.log(this.purchased)
          break;
      }
    }
  }

  changeMode() {
    this.mode = this.mode === 'items' ? 'history' : 'items';
  }

  scrollList() {
    console.log(this.list.nativeElement.scrollHeight)
    this.list.nativeElement.scrollTo({
      top: this.list.nativeElement.scrollHeight
    });
  }
}
