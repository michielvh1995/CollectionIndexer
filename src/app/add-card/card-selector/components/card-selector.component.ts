import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Card, CardVersion } from '../../../shared/models/card';
import { CollecteDBService } from '../../../shared/collecteDB/collecte-db.service';

@Component({
  selector: 'app-card-selector',
  templateUrl: '../pages/card-selector.component.html',
  styleUrls: [
    '../pages/card-selector.component.scss',
    '../pages/succes-animation.scss'
  ]
})
export class CardSelectorComponent {
  constructor(
    private collecteDBService: CollecteDBService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) {}

  ngOnInit() {
    // Call the scryfall API for information
    this.setInformation();
  }
  // Input field to determine what card we are displaying. All other information is derived from this
  @Input() public card! : Card;
  
  @Input() public finishes? : string[];
  
  // Form control fields
  tc = this.fb.array([]);

  finishCounterForm = this.fb.group({
    cardCounts: this.tc
  });

  // For displaying success or failure when posting the cards to the database
  public Submitted : boolean = false;
  
  // Status options are:
  // success -> Done
  // pending -> submitted, but not accepted or failed
  // failure -> submitted, but failed
  public Status : string = "none";

  // Set the values retrieved from the scryfall API locally
  // Then we calculate all fields that are derived from them (i.e. the form control)
  setInformation() {
    if(this.card.versions[0].possible_finishes !== undefined) {
      this.finishes=this.card.versions[0].possible_finishes;
    } else {
      console.error(`No possible finishes found for ${this.card.name}!`);
      return;
    }

    if(this.card.versions[0].possible_finishes !== undefined) 
      this.finishes=this.card.versions[0].possible_finishes;
      
    this.setupFormControl();    
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


  public SubmitCards() {
    if(this.Submitted) return;

    this.readData();
    
    // Set submitted
    this.Submitted = true;
    this.Status = "pending";
    this.ref.detectChanges();
    
    this.collecteDBService.postNewCards([this.card]).subscribe(res => {
      if(!res) {
        this.Status = "failure";
        this.Submitted = false;
        this.ref.detectChanges();
        console.log(`Failure to submit; status now ${this.Status}`);
        
      } else {
        this.Status = "success";
        console.log("Success");  
        this.ref.detectChanges();
      }
    });
  }

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

      this.totalSelected += count;
      versions.push(this.generateVersion(this.finishes[i], count));
    }

    this.card.versions = versions;
  }

  // Generates and sets a card version from the finish name and the number put in
  // Here we can use the card.versions[0] for the values of the multiverseID etc,
  // because input is a single card with a version. We use that CardVersion for the scryfall API aswell
  private generateVersion(finish : string, count : number) : CardVersion {
    return {
      "card_count" : count,
      "multiverseID" : this.card.versions[0].multiverseID,
      "set_code" : this.card.versions[0].set_code,
      "number" : this.card.versions[0].number,
      
      // TEMPORARY: Remove this with the updated card model
      "foil" : (finish !== "nonfoil"),
      // "finish" : finish
    } 
  }
}
