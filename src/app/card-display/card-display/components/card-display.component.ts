import { Component, Input } from '@angular/core';
import { Card, CardVersion } from '../../../shared/models/card';
import { ScryfallCardAPIModel } from '../../../shared/scryfallAPI/scyfall-api.service';

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
  public image_url? : string = "";
  public promotypes? : string[];

  public dual_face : boolean = false;
  private backside : boolean = false;

  // Set the values retrieved from the scryfall API locally
  // Then we calculate all fields that are derived from them (i.e. the form control)
  setInformation() {
    if(this.card.versions[0].image_url !== undefined) 
      this.image_url=this.card.versions[0].image_url;
    else {
      console.error(`No image found for ${this.card.name}!`);
      return;
    }

    this.dual_face = this.card.dual_face;

    if(this.card.versions[0].promotypes !== undefined) 
      this.promotypes = this.card.versions[0].promotypes;
  }

  flipImage() {
    if(this.backside) this.image_url = this.card.versions[0].image_url;
    else this.image_url = this.card.versions[0].backside_image;
    
    // Don't forget to flip the side
    this.backside = !this.backside;    
  }
}
