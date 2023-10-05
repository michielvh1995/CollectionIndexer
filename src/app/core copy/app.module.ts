import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';

import { SharedModule } from '../shared/shared.module';
import { AddCardModule } from '../add-card/add-card.module';
import { CardCollectionOverviewModule } from '../card-collection-overview/card-collection-overview.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    SharedModule,
    AddCardModule,
    CardCollectionOverviewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
