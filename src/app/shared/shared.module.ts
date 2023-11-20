import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const DECLARATIONS: any[] = [];

@NgModule({
  declarations: DECLARATIONS,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: DECLARATIONS
})
export class SharedModule { }
