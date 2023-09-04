import { Component } from '@angular/core';

import { CollecteDBService } from '../../../shared/collecteDB/collecte-db.service';
import { MessageService } from '../../../shared/messages/services/messages.service';
import { APICard, CardVersion } from '../../../shared/models/api';

@Component({
  selector: 'app-card-collection-overview',
  templateUrl: '../pages/card-collection-overview.component.html',
  styleUrls: ['../pages/card-collection-overview.component.scss']
})
export class CardCollectionOverviewComponent {
  cards : APICard[] = [];

  constructor(private collecteDBService: CollecteDBService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getAllCards();
  }

  getAllCards() : void {
    this.collecteDBService.getAllCards().subscribe(fetched => this.cards = fetched);
  }

  countCards(card: APICard) : number {
    var cnt = 0;
    for (var version of card.versions)
      cnt += version.card_count;
    
    console.log(cnt);
    return cnt;
  }
}
