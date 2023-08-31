import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/components/messages.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    MessagesComponent
  ]
})
export class SharedModule { }
