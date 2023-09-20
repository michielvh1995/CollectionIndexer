import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/components/messages.component';
import { HttpClientModule } from '@angular/common/http';
import { ColourSelectComponent } from './colour-select/components/colour-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MessagesComponent,
    ColourSelectComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MessagesComponent,
    ColourSelectComponent
  ]
})
export class SharedModule { }
