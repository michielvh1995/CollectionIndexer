import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-colour-select',
  templateUrl: '../pages/colour-select.component.html',
  styleUrls: ['../pages/colour-select.component.scss']
})
export class ColourSelectComponent {
  constructor() {
  }
  colourSelection = new FormGroup({
    wControl: new FormControl(false),
    uControl: new FormControl(false),
    bControl: new FormControl(false),
    rControl: new FormControl(false),
    gControl: new FormControl(false),
    cControl: new FormControl(false),
    matchControl : new FormControl('=')
  });

  validation() : boolean {
    if(this.colourSelection.value.cControl && this.colourSelection.value.matchControl != "<=") {
      if(this.colourSelection.value.wControl) return false;
      if(this.colourSelection.value.uControl) return false;
      if(this.colourSelection.value.bControl) return false;
      if(this.colourSelection.value.rControl) return false;
      if(this.colourSelection.value.gControl) return false;
    }
    return true;
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

  // I want to move this function from here to a superclass that gnerates the entire query
  public GenerateScryfallQuery() : string {
    var filter = new CardFilter(undefined, undefined, this.ReadData());

    
    console.log(`Filter is: ${filter.GenerateScryfallQuery()}`);
    
    return filter.GenerateScryfallQuery();
  }
}

export class ColourSelection {
  public W : boolean;
  public U : boolean;
  public B : boolean;
  public R : boolean;
  public G : boolean;
  public C : boolean;
  public MatchType : string;

  constructor(
     w: boolean = false, u: boolean = false, b: boolean = false,
     r: boolean = false, g: boolean = false, c: boolean = false,
     matchType: string = '='
     ) {
    this.W = w;
    this.U = u;
    this.B = b;
    this.R = r;
    this.G = g;
    this.C = c;
    this.MatchType = matchType;
  }

  // Cards are either coloured or colourless. Not both.
  // As a result you can only combine colourless with coloured if the query searched for a subset
  public Validate() : boolean {
    if(this.C && this.MatchType != '<=') {
      if(this.W) return false; 
      if(this.U) return false; 
      if(this.B) return false; 
      if(this.R) return false; 
      if(this.G) return false; 
    };
    return true;
  }

  public ToScryfallQuery() : string {
    if(!this.Validate()) return "";

    // Generate the base query.
    var query : string = "";
    if(this.W) query += 'w';
    if(this.U) query += 'u';
    if(this.B) query += 'b';
    if(this.R) query += 'r';
    if(this.G) query += 'g';
    if(this.C) query += 'c';

    if(query === "") return query;
    query = `+id${this.MatchType}${query}`;

    // Alright, now we have the weird case, we want to subset without getting colourless cards:
    if(!this.C && this.MatchType == '<=') {
      var cols : string[] = [];
      if(this.W) cols.push("id>=w");
      if(this.U) cols.push("id>=u");
      if(this.B) cols.push("id>=b");
      if(this.R) cols.push("id>=r");
      if(this.G) cols.push("id>=g");
      query += `+(${cols.join("+or+")})`
    }

    return query;
  }
}

export class CardFilter {
  public Colours? : ColourSelection;
  public Name? : string;
  public Setname? : string;

  constructor(name? : string, set? : string, colourFilter? : ColourSelection) {
    this.Colours = colourFilter;
    this.Name = name;
    this.Setname = set;
  }

  public GenerateScryfallQuery() : string {
    var query: string = "";
    
    if(this.Name) query+= `"${this.Name}"`;
    if(this.Setname) query += `+${this.Setname}`;
    if(this.Colours) query += this.Colours.ToScryfallQuery();
    return query;
  }

}