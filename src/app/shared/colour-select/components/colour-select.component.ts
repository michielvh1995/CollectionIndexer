import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-colour-select',
  templateUrl: '../pages/colour-select.component.html',
  styleUrls: ['../pages/colour-select.component.scss']
})
export class ColourSelectComponent {
  constructor() {}
  ngOnInit(){  }

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

  public ReadData() : string[] {
    // If the form is invalid yield nothing.
    // Otherwise we yield a string array with [match, colours]    
    if(!this.validation()) return [];
    
    var outputArray :string[] = [this.colourSelection.value.matchControl!];
    
    if(this.colourSelection.value.wControl) outputArray.push('w');
    if(this.colourSelection.value.uControl) outputArray.push('u');
    if(this.colourSelection.value.bControl) outputArray.push('b');
    if(this.colourSelection.value.rControl) outputArray.push('r');
    if(this.colourSelection.value.gControl) outputArray.push('g');
    if(this.colourSelection.value.cControl) outputArray.push('c');

    return outputArray;
  }

  public GenerateScryfallQuery() : string {
    var data = this.ReadData();
    if(data.length <= 1) return ""
    
    if(!this.colourSelection.value.cControl) {
      var negate = "";
      for (let i = 0; i < data.length; i++) {
        const colour = data[i];
        negate += `c>=${colour}`;
        
      }
    }

    return `id${data.concat('')}`;
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
}

export class FilterValues {
  public Colours? : ColourSelection;
  public Name? : string;
  public Setname? : string;

  constructor(name? : string, set? : string, colourSelection? : ColourSelection) {
    this.Colours = colourSelection;
    this.Name = name;
    this.Setname = set;
  }


  private coloursToScryfall() : string {
    if(!this.Colours) return "";

    // Generate the base query.
    var query = `id${this.Colours.MatchType}`;
    if(this.Colours.W) query += 'w';
    if(this.Colours.U) query += 'u';
    if(this.Colours.B) query += 'b';
    if(this.Colours.R) query += 'r';
    if(this.Colours.G) query += 'g';
    if(this.Colours.C) query += 'c';

    // Alright, now we have the weird case, we want to subset without getting colourless cards:
    if(!this.Colours.C && this.Colours.MatchType == '<=') {
      var cols : string[] = [];
      if(this.Colours.W) cols.push("id>=u");
      if(this.Colours.U) cols.push("id>=u");
      if(this.Colours.B) cols.push("id>=b");
      if(this.Colours.R) cols.push("id>=r");
      if(this.Colours.G) cols.push("id>=g");
      query += `+(${cols.concat("+or+")})`
    }

    
    return query;
  }
  public GenerateScryfallQuery() : string {
    return "";

  }
}