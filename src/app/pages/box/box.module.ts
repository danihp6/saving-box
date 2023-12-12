import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BoxComponent } from './box.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxLongPress2Module } from 'ngx-long-press2';

@NgModule({
  declarations: [BoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    NgxLongPress2Module,
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
