import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDisplayComponent } from './card-display/components/card-display.component';



@NgModule({
  declarations: [
    CardDisplayComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardDisplayComponent
  ]
})
export class CardDisplayModule { }
