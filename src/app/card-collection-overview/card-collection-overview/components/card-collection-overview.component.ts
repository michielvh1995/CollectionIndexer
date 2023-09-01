import { Component } from '@angular/core';

import { CollecteDBService } from '../../../shared/collecteDB/collecte-db.service';
import { MessageService } from '../../../shared/messages/services/messages.service';
import { Card } from '../../../shared/models/card';

@Component({
  selector: 'app-card-collection-overview',
  templateUrl: '../pages/card-collection-overview.component.html',
  styleUrls: ['../pages/card-collection-overview.component.scss']
})
export class CardCollectionOverviewComponent {
  cards: Card[] = [];

  constructor(private cardService: CollecteDBService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getAllCards();
  }

  getAllCards() : void {
    this.cardService.getAllCards().subscribe(fetched => this.cards = fetched);
  
  }
}
