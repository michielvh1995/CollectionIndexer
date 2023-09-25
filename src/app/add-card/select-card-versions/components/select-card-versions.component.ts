import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, ViewChild } from '@angular/core';

import { Card } from '../../../shared/models/card';
import { CardSelectorComponent } from '../../card-selector/components/card-selector.component';

import { ScryfallAPIService } from '../../../shared/scryfallAPI/scyfall-api.service';
import { CardFilterComponent } from '../../../card-filter/card-filter/components/card-filter.component';
import { CardSelection } from '../../../shared/models/filters';

@Component({
  selector: 'app-select-card-versions',
  templateUrl: '../pages/select-card-versions.component.html',
  styleUrls: ['../pages/select-card-versions.component.scss']
})
export class SelectCardVersionsComponent  {
  constructor(
    private scryfallAPIService: ScryfallAPIService
    ) { 
      console.warn("SelectCardVersionsComponent is deprecated!");
    }
    
    // Filters
    @ViewChild(CardFilterComponent) private cardFilter! : CardFilterComponent;

    // Used to read data from the card-selectors per card version
    @ViewChildren(CardSelectorComponent) private selectors? : QueryList<CardSelectorComponent>;
    
    queriedCards? : Card[];

    // TODO: make submission reversible on error
    @Input() success = false;

    // Used to notify the parent of card submission
    @Output() addCardsEvent  = new EventEmitter<Card[]>();

    submitted = false;

    onCardSearch() {
      if(!this.cardFilter.Validate()) return;

      var selection : CardSelection = this.cardFilter.ReadData();
      console.log(selection.GenerateScryfallQuery());

      this.scryfallAPIService.searchForCards(selection.GenerateScryfallQuery()).subscribe(fetched => {
        this.queriedCards = fetched;
      });
    }

    cardCount = 0;
    
    // Once we press the add cards button we add all the selected cards and versions to the selected list
    // This selected list is then pushed to the parent.
    addSelection() {
      var selectedCards : Card[] = [];

      this.selectors?.forEach(selector => {
        // Set the data in the card
        selector.readData();

        // Read the data from the card and update the selectedCards array
        if (selector.totalSelected > 0)
          selectedCards.push(selector.card);
        
        // Keep track of how many cards we are adding. 
        // Also used to ensure we are not sending an empty query
        this.cardCount += selector.totalSelected;
      });

      if(this.cardCount == 0) return;

      // Emit the addCardsEvent to the parent
      this.addCardsEvent.emit(selectedCards);
      this.submitted = true;
      this.cardFilter.Disable();
    }
}