import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CardFilterComponent } from '../../../card-filter/card-filter/components/card-filter.component';

import { CollecteDBService } from '../../../shared/collecteDB/collecte-db.service';
import { ScryfallAPIService, ScryfallCardAPIModel, ScryfallCardListAPIModel } from '../../../shared/scryfallAPI/scyfall-api.service';

import { Card, CardVersion } from '../../../shared/models/card';
import { MessageService } from '../../../shared/messages/services/messages.service';


@Component({
  selector: 'app-spell-book',
  templateUrl: '../pages/spell-book.component.html',
  styleUrls: ['../pages/spell-book.component.scss']
})
export class SpellBookComponent {
  constructor(
    private collecteDBService: CollecteDBService,
    private scryfallService : ScryfallAPIService,
    private messageServce : MessageService,
    private ref: ChangeDetectorRef
    )
  {}
  
  cards : Card[] = [];
  expanded : Boolean = false;
  showMissing : Boolean = false;

  set : string = "woe";

  url : string = "https://api.scryfall.com/cards/mom/230?format=image";
  
  @ViewChild(CardFilterComponent) private cardFilter! : CardFilterComponent;

  ngOnInit(): void {
    this.getAllCards();
  }

  Reset() : void {
    this.getAllCards();
  }

  ToggleSideBar() : void {
    this.expanded = !this.expanded;
  }

  FilterCollection() : void {
    var query = this.cardFilter.ReadData();
    query.Setname = this.set;
    
    var ownCards : Card[] = [];

    // var pageNo = 1;
    // We need to call the scryfallAPI service for the cards from scryfall....
    this.scryfallService.new_searchForCards(query.ToScryfallQuery(), 1).subscribe(fetched => {
      // var scryfallCards : ScryfallCardAPIModel[] = [];

      this.messageServce.add(`Retrieved ${fetched.total_cards} cards using the ScryfallAPI`);

      var queriedCards = this.scryfallService.scryfallListToCards(fetched);

      // Then we need to retrieve the cards we own in our collection
      this.collecteDBService.queryCards(query).subscribe(fsc => {
        this.messageServce.add(`SpellBook: Retrieved ${fsc.length} cards from collection.`);
        
        // We need to flatten down the card model we receive from the collecteDB service
        ownCards = this.flattenCards(fsc);
        
        // Then we need to annotate the ScryfallCards with their numbers:
        this.cards = this.addCardCounts(queriedCards, ownCards);
        console.log(`In total we have now annotated ${this.cards.length} cards`);
          
        if(!queriedCards.length || !ownCards.length) {
          console.log(`Either no cards found on scryfall (${queriedCards.length}) or in our database (${ownCards.length})!`);
        }
      });      

      this.ref.detectChanges();
    });

        
  }

  TrickleDownUpdates() : void {
    for (let i = 0; i < this.cards.length; i++)
      for(let j = 0; j < this.cards[i].versions.length; j++)
        this.cards[i].versions[j].card_count = 0;
    
    this.cards = this.collecteDBService.TrimCards(this.cards);
    
    this.collecteDBService.postNewCards(this.cards).subscribe(res => {
      if(!res) {
        this.ref.detectChanges();
        console.log(`Failure to submit;`);
        
      } else {
        console.log("Success");  
        this.ref.detectChanges();
      }
    });
  }

  getAllCards() : void {
    this.collecteDBService.getSomeCards(40).subscribe(
      fetched => {
        this.messageServce.add(`Retrieved ${fetched.length} cards.`);
        
        // We need additional information for the cards
        this.cards = this.flattenCards(this.annotateCards(fetched));
    });
  }

  private addCardCounts(cards : Card[], cardCounts : Card[]) {
    var newCards : Card[] = [];

    for (let j = 0; j < cards.length; j++) {
      const card = cards[j];
      
      var newVersions : CardVersion[] = [];
      for (let i = 0; i < cardCounts.length; i++) {
        const counterCard = cardCounts[i];

        if(counterCard.versions[0].number === card.versions[0].number && counterCard.versions[0].set_code === card.versions[0].set_code) {
          // Then create a new list of versions; containing the information from both.
          for (const version in counterCard.versions) {
            if (Object.prototype.hasOwnProperty.call(counterCard.versions, version)) {
              const ccVersion = counterCard.versions[version];
              newVersions.push({
                "card_count" : ccVersion.card_count,
                "set_code" : ccVersion.set_code,
                "number" : ccVersion.number,
                "finish" : ccVersion.finish,
                "image_url" : card.versions[0].image_url,
                "backside_image" : card.versions[0].backside_image,
                "promotypes" : card.versions[0].promotypes,
              });
            }
          }

        }      
      } // End of cardCounts loop
      if(newVersions.length) {
        card.versions = newVersions;
        newCards.push(card);
      } else if(this.showMissing) {
        card.versions[0].card_count = 0;
        newCards.push(card);
      }
      
    }
    return newCards;
  }

  private annotateCards(cards: Card[]) : Card[] {
    var out_cards : Card[] = [];
    for (let j = 0; j < cards.length; j++) {
      const card = cards[j];
      
      // Then loop over the versions, flatten them and push them to the array
      for (let i = 0; i < card.versions.length; i++) {
        var e = card.versions[i];
        e.image_url= `https://api.scryfall.com/cards/${e.set_code}/${e.number}?format=image`;
      }
      out_cards.push(card);
    }
    
    return out_cards;
  }

  // This function "flattens" a card: it creates a new Card instance per version.
  private flattenCards(cards: Card[]) : Card[] {
    var out_cards : Card[] = [];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];      
      var grouped : {[key:string]:CardVersion[]}= {};
      
      // We loop over the version in the card to check whether or not it has been seen before,
      //   based off of the set_code+number.
      // If it hasn't seen before it gets added to the list.
      card.versions.map(ver => {
        if(!grouped[`${ver.set_code}${ver.number}`]) 
          grouped[`${ver.set_code}${ver.number}`] = [];

        grouped[`${ver.set_code}${ver.number}`].push(ver);
      });
      
      // Now we flatten the dictionary into a list of Cards again. 
      // Each list of versions is one set of versions of the dictionary.
      for (let key in grouped)
        out_cards.push({
          "name" : card.name,
          "versions" : grouped[key]
        } as Card);
    }
    
    return out_cards;
  }


}
