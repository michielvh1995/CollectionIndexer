import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RaritySelection } from '../../../shared/models/filters';

@Component({
  selector: 'app-rarity-filter',
  templateUrl: '../pages/rarity-filter.component.html',
  styleUrls: ['../pages/rarity-filter.component.scss']
})
export class RarityFilterComponent {
  constructor () {}

  raritySelection = new FormGroup ({
    cControl: new FormControl(false),
    uControl: new FormControl(false),
    rControl: new FormControl(false),
    mControl: new FormControl(false),
    sControl: new FormControl(false)
  });

  public Validate() : boolean {
    return true;
  }

  public Disable() : void {
    this.raritySelection.disable();
  }
  
  public Enable() : void {
    this.raritySelection.enable();
  }

  public ReadData() {
     var rarityArray : string[] = [];
    if(this.raritySelection.value.cControl) rarityArray.push('c');
    if(this.raritySelection.value.uControl) rarityArray.push('u');
    if(this.raritySelection.value.rControl) rarityArray.push('r');
    if(this.raritySelection.value.mControl) rarityArray.push('m');
    if(this.raritySelection.value.sControl) rarityArray.push('s');
    
    return new RaritySelection(rarityArray);
  }
}
