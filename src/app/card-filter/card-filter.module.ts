import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardFilterComponent } from './card-filter/components/card-filter.component';
import { ColourFilterComponent } from './colour-filter/components/colour-filter.component';
import { RarityFilterComponent } from './rarity-filter/components/rarity-filter.component';
import { SetFilterComponent } from './set-filter/components/set-filter.component';


@NgModule({
  declarations: [
    CardFilterComponent,
    ColourFilterComponent,
    RarityFilterComponent,
    SetFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CardFilterComponent,
    ColourFilterComponent,
    SetFilterComponent
  ]
})
export class CardFilterModule { }
