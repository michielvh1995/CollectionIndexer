import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CardSelection, ColourSelection } from '../../../shared/models/filters';
import { BaseFilterComponent } from '../../base-filter/base-filter.component';

@Component({
  selector: 'app-colour-filter',
  templateUrl: '../pages/colour-filter.component.html',
  styleUrls: ['../pages/colour-filter.component.scss']
})

export class ColourFilterComponent extends BaseFilterComponent {
  colourSelection = new FormGroup({
    wControl: new FormControl(false),
    uControl: new FormControl(false),
    bControl: new FormControl(false),
    rControl: new FormControl(false),
    gControl: new FormControl(false),
    cControl: new FormControl(false),
    matchControl : new FormControl('=')
  });

  public Validate() : boolean {
    if(this.colourSelection.value.cControl && this.colourSelection.value.matchControl != "<=") {
      if(this.colourSelection.value.wControl) return false;
      if(this.colourSelection.value.uControl) return false;
      if(this.colourSelection.value.bControl) return false;
      if(this.colourSelection.value.rControl) return false;
      if(this.colourSelection.value.gControl) return false;
    }
    return true;
  }

  public Disable() : void {
    this.colourSelection.disable();
  }
  public Enable() : void {
    this.colourSelection.enable();
  }

  // Reading the data from the colourpicker yields a ColourSelection.
  public ReadData() : ColourSelection {  
    var colourFilter = new ColourSelection(
      this.colourSelection.value.wControl!,
      this.colourSelection.value.uControl!,
      this.colourSelection.value.bControl!,
      this.colourSelection.value.rControl!,
      this.colourSelection.value.gControl!,
      this.colourSelection.value.cControl!,
      this.colourSelection.value.matchControl!);

    return colourFilter;
  }
}