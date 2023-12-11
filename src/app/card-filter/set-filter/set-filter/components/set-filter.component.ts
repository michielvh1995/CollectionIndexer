import { Component, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseFilterComponent } from '../../../base-filter/base-filter.component';
import { SetSelection } from '../../../../shared/models/filters';
import { MTGSet } from '../../models/MTGSet';
import { SetSelectorComponent } from '../../set-selector/components/set-selector.component';

@Component({
  selector: 'app-set-filter',
  templateUrl: '../pages/set-filter.component.html',
  styleUrls: ['../pages/set-filter.component.scss']
})
export class SetFilterComponent extends BaseFilterComponent {
  expanded : boolean = false;

  @ViewChildren(SetSelectorComponent) setfilters? : QueryList<SetSelectorComponent>;

  constructor(private httpClient : HttpClient) {
    super();

    this.getSetsData();
  }

  ngAfterViewInit(){}

  searchValue? : string;

  all_sets : MTGSet[] = [];
  active_sets : MTGSet[] = [];
  
  getSetsData() {
    this.httpClient.get('../../../../assets/setdata_06-dec-2023.json').subscribe(res => {
      let setdata = res as {"sets": MTGSet[], "promosets": MTGSet[], "decks": MTGSet[], "ftv": MTGSet[]};
      console.log(`Retrieved ${setdata["sets"].length} normal, ${setdata["promosets"].length} promosets, ${setdata["decks"].length} duel decks, and ${setdata["ftv"].length} from the vault sets.`);

      this.all_sets = setdata["sets"];
      this.active_sets = this.all_sets;
    });
  }

  FilterSets() : void {
    console.log("Filtering sets");
    this.active_sets = [];
    
    let searchTerm = "";
    if(this.searchValue) {
      searchTerm = this.searchValue?.toLowerCase()
    } else {
      this.active_sets = this.all_sets;
      return;
    }

    for(const set of this.all_sets) {
      if (set.code.toLowerCase().includes(searchTerm) || set.name.toLowerCase().includes(searchTerm))
        this.active_sets.push(set);
    }
  }

  ToggleSideBar() : void {
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
    let selectedSets: string[] = [];

    this.setfilters?.forEach(filter => {
      selectedSets = selectedSets.concat(filter.ReadData());
    });

    console.log("Read data finished.");
    console.log(new SetSelection(selectedSets));
    
    return new SetSelection(selectedSets);
  }

}