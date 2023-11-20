import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BoxComponent } from './box.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [BoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    RouterModule.forChild([
      {
        path: '',
        component: BoxComponent
      }
    ]),
    SharedModule
  ]
})
export class BoxModule { }
