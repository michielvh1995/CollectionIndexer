import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardFilterComponent } from './card-filter/components/card-filter.component';
import { ColourFilterComponent } from './colour-filter/components/colour-filter.component';


@NgModule({
  declarations: [
    CardFilterComponent,
    ColourFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CardFilterComponent,
    ColourFilterComponent
  ]
})
export class CardFilterModule { }
