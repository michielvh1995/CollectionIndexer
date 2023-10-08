import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddCardPageComponent } from './add-card-page/components/add-card-page.component';
import { CardSelectorComponent } from './card-selector/components/card-selector.component';

import { SharedModule } from '../shared/shared.module';
import { CardFilterModule } from '../card-filter/card-filter.module';
import { CardSearchComponent } from './card-search/components/card-search.component';
import { CardDisplayModule } from '../card-display/card-display.module';



@NgModule({
  declarations: [
    AddCardPageComponent,
    CardSelectorComponent,
    CardSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CardFilterModule,
    CardDisplayModule
  ],
  exports:
  [
    AddCardPageComponent
  ]
})
export class AddCardModule { }
