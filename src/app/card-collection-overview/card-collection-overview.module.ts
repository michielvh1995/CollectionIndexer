import { NgModule } from '@angular/core';
import { CardCollectionOverviewComponent } from './card-collection-overview/components/card-collection-overview.component';
import { CommonModule } from '@angular/common';
import { SpellBookComponent } from './spell-book/components/spell-book.component';
import { CardFilterModule } from '../card-filter/card-filter.module';
import { CardDisplayModule } from "../card-display/card-display.module";



@NgModule({
    declarations: [
        CardCollectionOverviewComponent,
        SpellBookComponent
    ],
    imports: [
        CommonModule,
        CardFilterModule,
        CardDisplayModule
    ]
})
export class CardCollectionOverviewModule { }
