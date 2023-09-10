import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Card, CardVersion } from '../../../shared/models/card';
import { ScryfallAPIService, ScryfallCardAPIModel } from '../../../shared/scryfallAPI/scyfall-api.service';

@Component({
  selector: 'app-card-selector',
  templateUrl: '../pages/card-selector.component.html',
  styleUrls: ['../pages/card-selector.component.scss']
})
export class CardSelectorComponent {
  constructor(
    private scryfallAPIService : ScryfallAPIService,
    private fb: FormBuilder) {}

  // Input field to determine what card we are displaying. All other information is derived from this
  @Input() public card! : Card;
  
  // ScyrfallAPI data
  image_url : string = "";
  promotypes? : string[];
  finishes? : string[];
  
  // Form control fields
  tc = this.fb.array([]);

  finishCounterForm = this.fb.group({
    cardCounts: this.tc
  });

  ngOnInit() {
    // Call the scryfall API for information
    this.getInformation();
  }

  // Set the values retrieved from the scryfall API locally
  // Then we calculate all fields that are derived from them (i.e. the form control)
  getInformation() {
    this.scryfallAPIService.getCardInformation(this.card.versions[0].set_code, this.card.versions[0].number).subscribe( res => {
        this.setInformation(res);
        this.setupFormControl();
    })
  }

  // Set and clean the values retrieved from the ScryfallAPI
  setInformation(res : ScryfallCardAPIModel) {
    if(res.image_uris !== undefined)
      this.image_url = res.image_uris["normal"];

    if(res.promo_types !== undefined)
      this.promotypes = res.promo_types;
    
    if(res.finishes !== undefined) {
      this.finishes = res.finishes;
      
      // I prefer to read non foil over nonfoil (adding a space in between)
      for (let i = 0; i < this.finishes.length; i++)
        if(this.finishes[i] == "nonfoil")
          this.finishes[i] = "non foil";
    }
  }

  // This function is used to dynamically generate the form controls; 
  // we need one FromControl per type of finish. Sometimes this is one, two, or more
  setupFormControl() {    
    if(this.finishes === undefined)
      return;
    
    // Per finish we create one numeric input
    for (let i = 0; i < this.finishes.length; i++)      
      this.tc.push(this.fb.control(0));
  }

  // Generates and sets a card version from the finish name and the number put in
  // Here we can use the card.versions[0] for the values of the multiverseID etc,
  // because input is a single card with a version. We use that CardVersion for the scryfall API aswell
  private generateVersion(finish : string, count : number) : CardVersion {

    // TEMPORARY: Remove this with the updated card model
    var foilstatus = false;
    if(finish != "nonfoil")
      foilstatus = true;


    return {
      "card_count" : count,
      "multiverseID" : this.card.versions[0].multiverseID,
      "set_code" : this.card.versions[0].set_code,
      "number" : this.card.versions[0].number,
      "foil" : foilstatus,
      // "finish" : finish
    } 
  }


  cardCounterForm = new FormGroup({
    countControl: new FormControl(0),
    foilCountControl: new FormControl(0)
  });

  public totalSelected = 0;

     
  public readData() {
    var versions : CardVersion[] = [];

    if (this.finishes === undefined)
      return;

    for (let i = 0; i < this.finishes.length; i++) {
      // Dirty typecast to prevent errors
      var count = this.tc.at(i).value as number;

      if (count === 0)
        continue;

      // DEBUG
      console.log(`Added cards: ${this.card.versions[0].set_code}, ${this.finishes[i]} ${count}`);
      
      this.totalSelected += count;
      versions.push(this.generateVersion(this.finishes[i], count));
    }

    this.card.versions = versions;
  }
}
