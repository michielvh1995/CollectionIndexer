import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Card } from '../../../shared/models/card';
import { WizardsAPIService } from '../../../shared/wizardsAPI/wizards-api.service';
import { CardSelectorComponent } from '../../card-selector/components/card-selector.component';
import { ColourSelectComponent } from '../../../shared/colour-select/components/colour-select.component';
import { ScryfallAPIService } from '../../../shared/scryfallAPI/scyfall-api.service';

@Component({
  selector: 'app-select-card-versions',
  templateUrl: '../pages/select-card-versions.component.html',
  styleUrls: ['../pages/select-card-versions.component.scss']
})
export class SelectCardVersionsComponent  {
  constructor(
    private wizardsAPIService : WizardsAPIService,
    private scryfallAPIService: ScryfallAPIService
    ) { }
    
    queriedCards? : Card[];
    
    // Used to read data from the card-selectors per card version
    @ViewChildren(CardSelectorComponent) private selectors? : QueryList<CardSelectorComponent>;
    @ViewChild(ColourSelectComponent) private colourSelector! : ColourSelectComponent;

    // TODO: make submission reversible on error
    @Input() success = false;

    // Used to notify the parent of card submission
    @Output() addCardsEvent  = new EventEmitter<Card[]>();

    cardSelectorForm = new FormGroup({
      cardNameControl: new FormControl(''),
      cardSetControl: new FormControl('')
    });

    submitted = false;

    onCardSearch() {
      // Clean and set the card we're searching for
      var cardName = this.cardSelectorForm.value.cardNameControl?.trim().toLowerCase();
      var cardSet = this.cardSelectorForm.value.cardSetControl?.trim().toLowerCase();
      


      // Return on empty query
      if(!cardName && !cardSet) return;

      var queryString = `${this.colourSelector.GenerateScryfallQuery()}`;
      console.log(queryString);
      
      if(cardName) queryString+=`+name:${cardName}`;
      console.log(queryString);

      if(cardSet)  queryString+=`+set:${cardSet}`;
      console.log(queryString);

      this.scryfallAPIService.searchForCards(queryString).subscribe(fetched => {
        this.queriedCards = fetched;
      });

      // // Query the wizardsAPIService and set the queriedCards variable
      // this.wizardsAPIService.queryCardsByNameAndSet(cardName, cardSet)
      // .subscribe(fetched => {
      //   this.queriedCards = fetched;
      // });
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
    }
}