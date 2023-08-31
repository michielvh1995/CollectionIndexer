import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddCardPageComponent } from './add-card-page/components/add-card-page.component';
import { CardSelectorComponent } from './card-selector/components/card-selector.component';
import { SelectCardVersionsComponent } from './select-card-versions/components/select-card-versions.component';

import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AddCardPageComponent,
    CardSelectorComponent,
    SelectCardVersionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:
  [
    AddCardPageComponent
  ]
})
export class AddCardModule { }
