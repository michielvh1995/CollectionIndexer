import { NgModule } from '@angular/core';
import { CardCollectionOverviewComponent } from './card-collection-overview/components/card-collection-overview.component';
import { CommonModule } from '@angular/common';
import { SpellBookComponent } from './spell-book/components/spell-book.component';
import { CardFilterModule } from '../card-filter/card-filter.module';
import { CardDisplayModule } from "../card-display/card-display.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        CardCollectionOverviewComponent,
        SpellBookComponent
    ],
    imports: [
        CommonModule,
        CardFilterModule,
        CardDisplayModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class CardCollectionOverviewModule { }
