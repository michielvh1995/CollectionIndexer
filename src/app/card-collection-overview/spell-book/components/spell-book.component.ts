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
    this.collecteDBService.queryCards(this.cardFilter.ReadData()).subscribe(fetched => {
      this.messageServce.add(`Retrieved ${fetched.length} cards.`);
      
      // We need additional information for the cards
      this.cards = this.flattenCards(this.annotateCards(fetched));
    });
    
    this.ref.detectChanges();
  }

  getScryfallCards() : void {
    if(!this.cardFilter.Validate()) return;

    
  }

  getAllCards() : void {
    this.collecteDBService.getAllCards().subscribe(
      fetched => {
        this.messageServce.add(`Retrieved ${fetched.length} cards.`);
        
        // We need additional information for the cards
        this.cards = this.flattenCards(this.annotateCards(fetched));
    });
  }

  annotateCards(cards: Card[]) : Card[] {
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

  flattenCards(cards: Card[]) : Card[] {
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

      console.log(grouped);
      
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
