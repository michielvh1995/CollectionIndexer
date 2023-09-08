import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Card, CardVersion } from '../../../shared/models/card';
import { ScryfallAPIService } from '../../../shared/scryfallAPI/scyfall-api.service';

@Component({
  selector: 'app-card-selector',
  templateUrl: '../pages/card-selector.component.html',
  styleUrls: ['../pages/card-selector.component.scss']
})
export class CardSelectorComponent {
  constructor(private scryfallAPIService : ScryfallAPIService) {}
  
  image_url : string = "";
  promotypes? : string[];
  finishes? : string[];

  ngOnInit() {
    // Call the scryfall API for information
    this.getInformation();
  }

  getInformation() {
    this.scryfallAPIService.getCardInformation(this.card.versions[0].set_code, this.card.versions[0].number).subscribe( res => {
      if(res.image_uris !== undefined)
        this.image_url = res.image_uris["normal"];

        if(res.promo_types !== undefined)
          this.promotypes = res.promo_types
        if(res.finishes !== undefined)
          this.finishes = res.finishes
    })
  }


  cardCounterForm = new FormGroup({
    countControl: new FormControl(0),
    foilCountControl: new FormControl(0)
  });

  @Input() public card! : Card;
  public totalSelected = 0;

  getUrl() {
    this.image_url=`https://api.scryfall.com/cards/${this.card.versions[0].set_code}/${this.card.versions[0].number}?format=image`;

    console.log(`https://api.scryfall.com/cards/${this.card.versions[0].set_code}/${this.card.versions[0].number}?format=image`)
    return `https://api.scryfall.com/cards/${this.card.versions[0].set_code}/${this.card.versions[0].number}?format=image`
  }

  public readData() {
    // First we determine whether or not we have any cards selected.
    var regularCount = this.cardCounterForm.value.countControl;
    var foilCount = this.cardCounterForm.value.foilCountControl;

    var versions : CardVersion[] = [];

    // If we do have cards selected we generate the card object.
    if (regularCount && regularCount > 0) {
      var regularVersion = {
        "card_count" : regularCount,
        "multiverseID" : this.card.versions[0].multiverseID,
        "set_code" : this.card.versions[0].set_code,
        "foil" : false,
        "number" : this.card.versions[0].number
      } as CardVersion;

      versions.push(regularVersion);
      this.totalSelected += regularCount;
    }

      // Now we generate the foil cards version object
      if (foilCount && foilCount > 0) {
        var foilVersion = {
          "card_count" : foilCount,
          "multiverseID" : this.card.versions[0].multiverseID,
          "set_code" : this.card.versions[0].set_code,
          "number" : this.card.versions[0].number,
          "foil" : true
        } as CardVersion;
        
        versions.push(foilVersion);
        this.totalSelected += foilCount;
      }

      this.card.versions = versions;
  }
}
