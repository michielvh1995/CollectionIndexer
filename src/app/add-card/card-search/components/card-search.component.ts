import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ScryfallAPIService, ScryfallCardAPIModel, ScryfallCardListAPIModel } from '../../../shared/scryfallAPI/scyfall-api.service';
import { CardFilterComponent } from '../../../card-filter/card-filter/components/card-filter.component';
import { CardSelectorComponent } from '../../card-selector/components/card-selector.component';
import { Card } from '../../../shared/models/card';
import { Observable, of } from 'rxjs';

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
      console.log(this.cardFilter.ReadData().GenerateScryfallQuery());
      
      // Reset these when pressing the search button
      this.HasMore = false;
      this.HasPrevious = false;
      this.pageNo = 1;

      // Then we query the cards
      this.queryCards();
    }

    private queryCards() {
      this.scryfallAPIService.new_searchForCards(this.cardFilter.ReadData().GenerateScryfallQuery(), this.pageNo).subscribe(fetched => {
        if(fetched.has_more) this.HasMore = true; // I love the way this boolean evaluates here
        else this.HasMore = false;
        
        // To display the showing x out of Y cards
        this.totalQueried = fetched.total_cards;
        
        // Now we have to breakdown to cards...
        this.queriedCards = this._scryfallToCards(fetched);
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


    _scryfallCardToCard(scryfallCard : ScryfallCardAPIModel) : Card {
      // console.log(`${scryfallCard.set}:${scryfallCard.collector_number}`);
      var card = {"name" : scryfallCard.name,
      "versions" : [{
        "card_count": 1,
        "set_code" : scryfallCard.set,
        "number" : scryfallCard.collector_number,

        "promotypes" : scryfallCard.promo_types,
        "possible_finishes" : scryfallCard.finishes
      }]} as Card;

      // currently this is the best check to see if a card is dual-faced...
      // There are "double" cards on front-faces (i.e. adventures or dusk // dawn etc).
      // but these all have image_uris in the first layer of their JSON.
      // The dual faced ones do not have this
      if(scryfallCard.image_uris)
        card.versions[0].image_url = scryfallCard.image_uris["normal"];
      else if(scryfallCard.card_faces) {
        card.dual_face = true;
        card.versions[0].image_url = scryfallCard.card_faces[0]["image_uris"]["normal"];
        card.versions[0].backside_image = scryfallCard.card_faces[1]["image_uris"]["normal"];
      }
        

      return card;
    }

    private _scryfallToCards(scryfallData : ScryfallCardListAPIModel) {
      var cardsArray : Card[] = [];
      if(!scryfallData.data) return [];

      for (let i = 0; i < scryfallData.data.length; i++)
          cardsArray.push(this._scryfallCardToCard(scryfallData.data[i]));

      return cardsArray;
    }
}
