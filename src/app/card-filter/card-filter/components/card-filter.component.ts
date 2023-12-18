import { Component, Input, ViewChild } from '@angular/core';
import { ColourFilterComponent } from '../../colour-filter/components/colour-filter.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CardSelection, SetSelection } from '../../../shared/models/filters';
import { RarityFilterComponent } from '../../rarity-filter/components/rarity-filter.component';
import { BaseFilterComponent } from '../../base-filter/base-filter.component';


@Component({
  selector: 'app-card-filter',
  templateUrl: '../pages/card-filter.component.html',
  styleUrls: ['../pages/card-filter.component.scss']
})
export class CardFilterComponent implements BaseFilterComponent {
  @Input() enableSet : boolean = true;

  @ViewChild(ColourFilterComponent) private colourSelector! : ColourFilterComponent;
  @ViewChild(RarityFilterComponent) private raritySelector! : RarityFilterComponent;

  cardSelectorForm = new FormGroup({
    cardNameControl: new FormControl(''),
    cardStrictNameControl : new FormControl(false),
    boosterfunControl : new FormControl(false),
    cardSetControl: new FormControl(''),
    cardOrdering : new FormControl('set')
  });

  public Disable() : void {
    this.cardSelectorForm.disable();
    this.colourSelector.Disable();
    this.raritySelector.Disable();
  }
  public Enable() : void {
    this.cardSelectorForm.enable();
    this.colourSelector.Enable();
    this.raritySelector.Enable();
  }

  public Validate() {
    // if(this.cardSelectorForm.value.cardNameControl == "" && this.cardSelectorForm.value.cardSetControl == "") return false;
    if(!this.colourSelector.Validate()) return false;
    if(!this.raritySelector.Validate()) return false;
    return true;
  }

  public ReadData() : CardSelection{
    // Clean and set the card we're searching for
    var cardName = this.cardSelectorForm.value.cardNameControl?.trim().toLowerCase();
    var cardSet = this.cardSelectorForm.value.cardSetControl?.trim().toLowerCase();

    let ordering;
    if(this.cardSelectorForm.value.cardOrdering)
      ordering = this.cardSelectorForm.value.cardOrdering;

     // Enable or disable boosterfun.
    let uniqueType = "name";
    if(this.cardSelectorForm.value.boosterfunControl === true) uniqueType = "prints";

    console.log(`${uniqueType}, because boosterfun is ${this.cardSelectorForm.value.boosterfunControl}`);
    

    var strictName = false;
    if(this.cardSelectorForm.value.cardStrictNameControl)
      strictName = true;

    let selection = new CardSelection(cardName, strictName, undefined, ordering, 1, uniqueType);
    selection.AddFilter(this.colourSelector.ReadData());
    selection.AddFilter(this.raritySelector.ReadData());
    
    if(cardSet)
      selection.AddFilter(new SetSelection([cardSet]));

    return selection;
  }

  public Reset(): void {
    this.cardSelectorForm.reset();
    this.colourSelector.Reset();
    this.raritySelector.Reset();
  }

}