import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CardFilterComponent } from '../../../card-filter/card-filter/components/card-filter.component';

import { CollecteDBService } from '../../../shared/collecteDB/collecte-db.service';
import { ScryfallAPIService } from '../../../shared/scryfallAPI/scyfall-api.service';

import { Card, CardVersion } from '../../../shared/models/card';
import { MessageService } from '../../../shared/messages/services/messages.service';
import { FormControl, FormGroup } from '@angular/forms';


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

  spellbookForm = new FormGroup({
    missingControl : new FormControl(false),
    boosterfunControl : new FormControl(false),
  });
  
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
    let query = this.cardFilter.ReadData();
    query.Setname = this.set;
    
    // Enable or disable show missing
    if(this.spellbookForm.value.missingControl != undefined)
      this.showMissing = this.spellbookForm.value.missingControl;

    // Enable or disable boosterfun.
    let uniqueType = "name";
    if(this.spellbookForm.value.boosterfunControl === true) uniqueType = "prints";
    
    let ownCards : Card[] = [];

    // let pageNo = 1;
    // We need to call the scryfallAPI service for the cards from scryfall....
    this.scryfallService.new_searchForCards(query.ToScryfallQuery(), 1, uniqueType).subscribe(fetched => {
      let queriedCards = this.scryfallService.scryfallListToCards(fetched);
      
      // Then we need to retrieve the cards we own in our collection
      this.collecteDBService.queryCards(query).subscribe(fsc => {
        console.log(`SpellBook: Retrieved ${fsc.length} cards from collection.`);
        
        // We need to flatten down the card model we receive from the collecteDB service
        ownCards = this.flattenCards(fsc);
        
        // Then we need to annotate the ScryfallCards with their numbers:
        this.cards = this.addCardCounts(queriedCards, fsc);
        console.log(`In total we have now annotated ${this.cards.length} cards`);
          
        if(!queriedCards.length || !ownCards.length)
          this.messageServce.add(`Either no cards found on scryfall (${queriedCards.length}) or in our database (${ownCards.length})! Show missing cards is set to ${this.showMissing}.`);

      });      

      this.ref.detectChanges();
    });
  }

  TrickleDownUpdates() : void {
    
    this.collecteDBService.UpdateCards(this.cards).subscribe(res => {
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

  // CUrrently the bug in thisfunction is: 
  // in the Scryfallmodel we do not have a finish field. Only possible finishes.
  private mergeVersions(card : Card, card2: Card) : CardVersion[] {
    // First we fill a dictionary with versions, then update their counts.
    let versionsDictionary : {[key:string] : CardVersion} = {};

    for(const version of card.versions) {
      const key = `${version.set_code}${version.number}${version.finish}`;
      versionsDictionary[key] = version;
    }

    // Then add the counts if they're the same version.
    for(const version of card2.versions) {
      const key = `${version.set_code}${version.number}${version.finish}`;

      if(key in versionsDictionary) 
        versionsDictionary[key].card_count = version.card_count;
    }

    return Object.values(versionsDictionary);
  }

  // The inner for-loop, combined with the mergeVersions function does a lot of double work.
  // TODO: Refactor this.
  private addCardCounts(cards : Card[], cardCounts : Card[]) {    
    // First we fill the cardDictionary with the card versions
    let cardDictionary : {[key:string] : Card} = {};

    for(const card of cards) {
      let key = `${card.versions[0].set_code}${card.versions[0].number}`;
      
      cardDictionary[key] = card;
    }

    // Now loop over all the versions in the cardCounts array
    for(const card of cardCounts) {
      for(const version of card.versions) {
        // If the setcode/number combination exists in the dictionary.
        const key = `${version.set_code}${version.number}`;

        if(key in cardDictionary) 
          cardDictionary[key].versions = this.mergeVersions(cardDictionary[key], card);
      }
    }

    // We return everything if we show the missing cards as well. Otherwise we filter.
    
    let cardList : Card[] = [];
    for(const key in cardDictionary) {
      let sum = 0;
      for(const version of cardDictionary[key].versions)
        sum += version.card_count;

      // We also set the card as missing, for display purposes.
      // There should be a more efficient way.
      // TODO: Refactor this
      if(sum === 0) cardDictionary[key].missing = true;
      if(sum > 0) cardList.push(cardDictionary[key]);
    }

    if(this.showMissing)
      return Object.values(cardDictionary);

    return cardList;
  }

  // The cards array input is a pass-by-reference. As such the input array gets edited as well.
  // This can either be used to our advantage of needs to be removed.
  // TODO: Refactor this
  private annotateCards(cards: Card[]) : Card[] {
    let out_cards : Card[] = [];
    
    for(const card of cards ) {

      for(let version of card.versions) {
        version.image_url = `https://api.scryfall.com/cards/${version.set_code}/${version.number}?format=image`;
      }

      out_cards.push(card);
    }
    
    return out_cards;
  }

  // This function "flattens" a card: it creates a new Card instance per version.
  private flattenCards(cards: Card[]) : Card[] {
    let out_cards : Card[] = [];

    for (const card of cards) {
      let grouped : {[key:string]:CardVersion[]}= {};
      
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
