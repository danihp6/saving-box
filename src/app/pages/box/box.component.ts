import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Box, PurchasedItem } from 'src/app/core/models/SavingBox';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoxesService } from 'src/app/core/services/boxes.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent {
  @ViewChild('list') list!: ElementRef<HTMLDivElement>;
  box: Box = {
    id: '',
    owner: '',
    type: 'box',
    title: 'box'
  };
  financesOpened = false;
  transactionValue = 0;
  mode: 'shopping' | 'purchased' = 'shopping';
  dragging = false;
  readonly now = new Date();

  constructor(private route: ActivatedRoute, private router: Router, private boxesService: BoxesService) {
    this.route.params.subscribe({
      next: params => {
        this.boxesService.getBox(params['id']).subscribe({
          next: response => {
            this.box = response.box;
            this.dateItems();
          }
        });
      }
    });
    App.addListener('backButton', () => {
      router.navigate(['..']);
    });
  }

  newItem() {
    if (!this.box.shoppingItems) {
      this.box.shoppingItems = [];
    }
    this.box.shoppingItems.push({
      amount: 0,
      name: 'item'
    });
    this.boxesService.editBox(this.box).subscribe();
    this.scrollList();
  }

  editItem() {
    this.boxesService.editBox(this.box).subscribe();
  }

  openfinances() {
    this.financesOpened = !this.financesOpened;
  }

  transaction(op: '+' | '-') {
    if (this.box.savings === undefined) {
      this.box.savings = 0;
    }
    switch(op) {
      case '+':
        this.box.savings += this.transactionValue;
        break;
      case '-':
        this.box.savings -= this.transactionValue;
        break;
    }
    this.boxesService.editBox(this.box).subscribe();
  }

  editIncomings() {
    this.boxesService.editBox(this.box).subscribe();
  }

  drop(event: any) {
    if (event.container.id === event.previousContainer.id) {
      moveItemInArray(this.box.shoppingItems!, event.previousIndex, event.currentIndex);
      this.boxesService.editBox(this.box).subscribe();
    } else {
      switch (event.container.id) {
        case 'delete':
          this.box.shoppingItems!.splice(event.previousIndex, 1);
          this.boxesService.editBox(this.box).subscribe();
          break;
        case 'purchased':
          if (!this.box.purchasedItems) {
            this.box.purchasedItems = [];
          }
          transferArrayItem(
            this.box.shoppingItems!,
            this.box.purchasedItems,
            event.previousIndex,
            event.currentIndex
          );
          this.box.purchasedItems[0].date = new Date(Date.now());
          this.box.savings! -= this.box.purchasedItems[0].amount;
          this.boxesService.editBox(this.box).subscribe();
          break;
      }
    }
  }

  dateItems() {
    const dates: {date: Date; items: PurchasedItem[]}[] = [];
    this.box.purchasedItems?.forEach(item => {
      if (item.date.getMonth() === this.now.getMonth() && item.date.getFullYear() === this.now.getFullYear()) {
        const dayItems = dates.find(d => d.date.getFullYear() === this.now.getFullYear() && d.date.getMonth() === this.now.getMonth() && d.date.getDate() === item.date.getDate());
        if (!dayItems) {
          dates.push({
            date: new Date(this.now.getFullYear(), this.now.getMonth(), item.date.getDate()),
            items: [item]
          });
        } else {
          dayItems.items.push(item)
        }
      } else if (item.date.getFullYear() === this.now.getFullYear()) {
        const monthItems = dates.find(d => d.date.getFullYear() === this.now.getFullYear() && d.date.getMonth() === item.date.getMonth());
        if (!monthItems) {
          dates.push({
            date: new Date(this.now.getFullYear(), this.now.getMonth() - 1, 1),
            items: [item]
          });
        } else {
          monthItems.items.push(item);
        }
      } else {
        const yearItems = dates.find(d => d.date.getFullYear() === item.date.getFullYear());
        if (!yearItems) {
          dates.push({
            date: new Date(item.date.getFullYear(), 0, 1),
            items: [item]
          });
        } else {
          yearItems.items.push(item);
        }
      }
    });
    return dates.sort((a,b) => b.date.getTime() - a.date.getTime());
  }

  changeMode() {
    this.mode = this.mode === 'shopping' ? 'purchased' : 'shopping';
  }

  scrollList() {
    this.list.nativeElement.scrollTo({
      top: this.list.nativeElement.scrollHeight
    });
  }

  goBack() {
    this.router.navigate(['..']);
  }
}
