import { Component, ViewChild } from '@angular/core';
import { ScryfallAPIService, ScryfallCardAPIModel, ScryfallCardListAPIModel } from '../../../shared/scryfallAPI/scyfall-api.service';
import { CardFilterComponent } from '../../../card-filter/card-filter/components/card-filter.component';
import { Card } from '../../../shared/models/card';

@Component({
  selector: 'app-card-search',
  templateUrl: '../pages/card-search.component.html',
  styleUrls: ['../pages/card-search.component.scss']
})
export class CardSearchComponent {
  constructor(
    private scryfallAPIService: ScryfallAPIService
    ) { }
    
    // Filters
    @ViewChild(CardFilterComponent) private cardFilter! : CardFilterComponent;

    // Here we have the data from the Scryfall API:
    public HasPrevious : boolean = false;
    public HasMore : boolean = false;
    pageNo : number = 1;

    // To display the showing x out of Y cards
    totalQueried : number = 0;

    queriedCards? : Card[];
    
    onCardSearch() {
      if(!this.cardFilter.Validate()) return;

      // Console logging
      console.log(this.cardFilter.ReadData().ToScryfallQuery());
      
      // Reset these when pressing the search button
      this.HasMore = false;
      this.HasPrevious = false;
      this.pageNo = 1;

      // Then we query the cards
      this.queryCards();
    }

    private queryCards() {
      this.scryfallAPIService.new_searchForCards(this.cardFilter.ReadData().ToScryfallQuery(), this.pageNo).subscribe(fetched => {
        if(fetched.has_more) this.HasMore = true; // I love the way this boolean evaluates here
        else this.HasMore = false;
        
        // To display the showing x out of Y cards
        this.totalQueried = fetched.total_cards;
        
        // Now we have to breakdown to cards...
        this.queriedCards = this.scryfallAPIService.scryfallListToCards(fetched);
        // this.queriedCards = this._scryfallToCards(fetched);
      });
    }

    nextPage() {
      if(this.HasMore) {
        this.pageNo +=1;
        this.HasPrevious = true;

        this.queryCards();        
      }
    }

    PreviousPage() {
      if(this.HasPrevious) {
        this.pageNo -=1;
        this.HasMore = true;
        this.queryCards();
      }
       // Page 1 is the first page possible
      if(this.pageNo == 1) this.HasPrevious = false;
    }
}
