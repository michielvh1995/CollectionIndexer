import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardFilterComponent } from './card-filter/components/card-filter.component';
import { ColourFilterComponent } from './colour-filter/components/colour-filter.component';
import { RarityFilterComponent } from './rarity-filter/components/rarity-filter.component';


@NgModule({
  declarations: [
    CardFilterComponent,
    ColourFilterComponent,
    RarityFilterComponent
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
