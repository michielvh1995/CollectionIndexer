import { Component, Input } from '@angular/core';
import { Card, CardVersion } from '../../../shared/models/card';

@Component({
  selector: 'app-card-display',
  templateUrl: '../pages/card-display.component.html',
  styleUrls: ['../pages/card-display.component.scss']
})
export class CardDisplayComponent {
  ngOnInit() {
    // Call the scryfall API for information
    this.setInformation();
  }

  // Input field to determine what card we are displaying. All other information is derived from this
   @Input() public card! : Card;
  
   // ScryfallAPI data
   @Input() public image_url? : string = "";
   @Input() public promotypes? : string[];
   @Input() public finishes? : string[];
 
   // Set the values retrieved from the scryfall API locally
   // Then we calculate all fields that are derived from them (i.e. the form control)
   setInformation() {
    console.log("Before");
    
     if(this.card.versions[0].image_url !== undefined) 
       this.image_url=this.card.versions[0].image_url;
     else {
       console.error(`No image found for ${this.card.name}!`);
       return;
     }
     console.log("Image set");

     if(this.card.versions[0].possible_finishes !== undefined) 
       this.finishes=this.card.versions[0].possible_finishes;
     else {
       console.error(`No possible finishes found for ${this.card.name}!`);
       return;
     }
 
     console.log("Finishes set");

     if(this.card.versions[0].promotypes !== undefined) 
       this.promotypes = this.card.versions[0].promotypes;
     
     if(this.card.versions[0].possible_finishes !== undefined) 
       this.finishes=this.card.versions[0].possible_finishes;
  }

}
