import { Component, ViewChild } from '@angular/core';
import { CardFilterComponent } from '../../../card-filter/card-filter/components/card-filter.component';
import { ColourFilterComponent } from '../../../card-filter/colour-filter/components/colour-filter.component';

@Component({
  selector: 'app-spell-book',
  templateUrl: '../pages/spell-book.component.html',
  styleUrls: ['../pages/spell-book.component.scss']
})
export class SpellBookComponent {
  constructor(){}
  @ViewChild(CardFilterComponent) private cardFilter! : CardFilterComponent;

  ngOnInit() {
  }


}
