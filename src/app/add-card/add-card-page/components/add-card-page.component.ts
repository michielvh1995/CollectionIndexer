import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { CollecteDBService } from '../../../shared/collecteDB/collecte-db.service'
import { Card } from '../../../shared/models/card';

@Component({
  selector: 'app-add-card-page',
  templateUrl: '../pages/add-card-page.component.html',
  styleUrls: ['../pages/add-card-page.component.scss']
})
export class AddCardPageComponent {
  constructor(
    private location : Location,
    private collecteDBService : CollecteDBService
  ) {
    
  }

  items? : Card[];
  submittedStatus = [true];
  indices = [1];

  // addCards(cards : Card[]) {
  //   this.items = cards;

  //   console.log("We're in add-care-page, adding cards:");
  //   console.log(cards);
    
    
  //   // This is done to create a new instance of the mutli-card-selector
  //   this.collecteDBService.postNewCards(cards).subscribe(result => {
  //     if (!result) {
  //       this.submittedStatus[this.submittedStatus.length-1] = false;
  //       console.log("failed");
  //     }
  //     else {
  //       this.submittedStatus[this.submittedStatus.length-1] = true;
  //       this.submittedStatus[this.submittedStatus.length] = false;
  //       this.indices[this.indices.length] = this.indices[this.indices.length-1] + 1
        
  //       console.log('success');
  //     }
  //     console.log(this.submittedStatus);
  //     console.log(this.indices);
  //   });

  // }

  goBack(): void {
    this.location.back();
  }
}
