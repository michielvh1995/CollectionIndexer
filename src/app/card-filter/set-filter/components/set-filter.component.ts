import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseFilterComponent } from '../../base-filter/base-filter.component';
import { BaseSelection, SetSelection } from '../../../shared/models/filters';

@Component({
  selector: 'app-set-filter',
  templateUrl: '../pages/set-filter.component.html',
  styleUrls: ['../pages/set-filter.component.scss']
})
export class SetFilterComponent extends BaseFilterComponent {
  public Sets : string[] = [];
  expanded : Boolean = false;

  constructor(private httpClient : HttpClient) {
    super();

    this.getSetsData();
  }

  all_sets : MTGSet[] = [];
  getSetsData() {
    this.httpClient.get('../../../../assets/setdata_06-dec-2023.json').subscribe(res => {
      let setdata = res as {"sets":MTGSet[], "promosets":MTGSet[]};
      this.all_sets = setdata["sets"];
      console.log(this.all_sets.length);
    });
  }


  ToggleSideBar() : void {
    console.log("Pressed the expand button");
    
    this.expanded = !this.expanded;
  }

  public Reset(): void {
    throw new Error('Method not implemented.');
  }
  public Disable(): void {
    throw new Error('Method not implemented.');
  }
  public Enable(): void {
    throw new Error('Method not implemented.');
  }
  public Validate(): boolean {
    throw new Error('Method not implemented.');
  }
  public ReadData(): SetSelection {
    return new SetSelection(this.Sets);
  }

}


interface MTGSet {
  code: string;   // For search etc.
  name: string;   // Full name for display
  type: string;   // Promo, commander, expansion etc. Will be used to filter on
  icon: string;   // Set icon for display small

  children: MTGSet[];
}