import { Component, Input, ViewChild } from '@angular/core';
import { ColourFilterComponent } from '../../colour-filter/components/colour-filter.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CardSelection } from '../../../shared/models/filters';
import { RarityFilterComponent } from '../../rarity-filter/components/rarity-filter.component';


@Component({
  selector: 'app-card-filter',
  templateUrl: '../pages/card-filter.component.html',
  styleUrls: ['../pages/card-filter.component.scss']
})
export class CardFilterComponent {
  @Input() enableSet : boolean = true;

  @ViewChild(ColourFilterComponent) private colourSelector! : ColourFilterComponent;
  @ViewChild(RarityFilterComponent) private raritySelector! : RarityFilterComponent;


  cardSelectorForm = new FormGroup({
    cardNameControl: new FormControl(''),
    cardStrictNameControl : new FormControl(false),
    cardSetControl: new FormControl('')
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

    var strictName = false;
    if(this.cardSelectorForm.value.cardStrictNameControl)
      strictName = true;

    return new CardSelection(cardName, strictName, cardSet, undefined, this.colourSelector.ReadData(), this.raritySelector.ReadData());
  }
}