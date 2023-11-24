export abstract class BaseSelection {
  public abstract Validate() : boolean;
  public abstract ToScryfallQuery() : string;
  public abstract ToDictionary() : {[key:string]: any};
}

export class CardSelection extends BaseSelection {
    public Colours? : ColourSelection;
    public Rarities? : RaritySelection;
    public Sets? : SetSelection;

    public Name? : string;
    public StrictName : boolean = false;
    public Number? : string;
    public PageNo? : number;

    public Setname? : string;

    constructor(name? : string, 
        strictName?: boolean,
        set? : string,
        number? : string,
        colourFilter? : ColourSelection,
        rarityFilter? : RaritySelection,
        setFilter? : SetSelection,
        page? : number) 
    {
      super();

      this.Colours = colourFilter;
      this.Rarities = rarityFilter;
      this.Sets = setFilter;
      this.Name = name;
      this.Setname = set;
      this.PageNo = page;

      if(strictName != undefined)
        this.StrictName = strictName;
    }

    public Validate() : boolean {
      if(this.Colours) if(!this.Colours.Validate()) return false;
      if(this.Rarities) if(!this.Rarities.Validate()) return false;
      return true;
    }
    
    // TODO: Move this to the Scryfall API?
    public ToScryfallQuery() : string {
      var query: string = "";
      
      if(this.Name)
        if(this.StrictName)
          query+= `name:"${this.Name}"`;
        else
          query+= `name:${this.Name}`;
      
      if(this.Setname) query += `+set:${this.Setname}`;
      if(this.Colours) query += `+${this.Colours.ToScryfallQuery()}`;
      if(this.Rarities) query += `+${this.Rarities.ToScryfallQuery()}`;
      return query;
    }

    public ToDictionary() : {[key:string]: any} {
      var dict : {[key:string]: any} = {};

      if(this.Name) dict["name"] = this.Name;
      if(this.Setname) dict["set"] = this.Setname;
      if(this.Number) dict["number"] = this.Number;
      if(this.PageNo) dict["page"] = this.PageNo;
      if(this.Colours) dict["colours"] = this.Colours.ToList();
      if(this.Rarities) dict["rarities"] = this.Rarities.ToList();
      if(this.Sets) dict["sets"] = this.Sets.ToList();

      return dict;
    }
  }

export class CardSelectionGeneric extends CardSelection {
  public Filters : BaseSelection[];

  constructor(
    Name? : string, 
    StrictName : boolean = false,
    Number? : string,
    colourFilter? : ColourSelection,
    rarityFilter? : RaritySelection,
    setFilter? : SetSelection,
    PageNo : number = 1)
  {
    super(Name, StrictName, Number, undefined, undefined, undefined, undefined, PageNo);
    
    this.Filters = [];
    if(colourFilter) this.Filters.push(colourFilter);
    if(rarityFilter) this.Filters.push(rarityFilter);
    if(setFilter) this.Filters.push(setFilter);
  }

  public AddFilter(filter : BaseSelection) : void {
    this.Filters.push(filter);
  }

  public override Validate() : boolean{
    for (let i = 0; i < this.Filters.length; i++)
      if (!this.Filters[i].Validate()) return false;
    
    return true;
  }

  public override ToDictionary(): { [key: string]: any; } {
    var dict : {[key:string]: any} = {};

    if(this.Name) dict["name"] = this.Name;
    if(this.Number) dict["number"] = this.Number;
    if(this.PageNo) dict["page"] = this.PageNo;

    // Then we add all the key-value pairs from the fitlers to this one:
    for (let i = 0; i < this.Filters.length; i++)
      dict = {... dict,...this.Filters[i].ToDictionary};

    return dict;
  }
}


export class ColourSelection extends BaseSelection {
  constructor(
      public W: boolean = false, public U: boolean = false, public B: boolean = false,
      public R: boolean = false, public G: boolean = false, public C: boolean = false,
      public MatchType: string = '='
    ) {
    super();
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
    }

    // Finally the default
    return true;
  }

  // TODO: Move this to the Scryfall API
  public ToScryfallQuery() : string {
    if(!this.Validate()) return "";

    // Generate the base query.
    var query : string = "";
    if(this.W) query += 'w';
    if(this.U) query += 'u';
    if(this.B) query += 'b';
    if(this.R) query += 'r';
    if(this.G) query += 'g';

    // The Scryfall API does weird things with the subset of selector.
    // We either have to explicitly tell them we allow colourless cards or we really don't want colourless cards
    if(this.MatchType == "<=") {
      if(this.C) {
        query += "+or+id=c"
      } else {
        var cols : string[] = [];
        if(this.W) cols.push("id>=w");
        if(this.U) cols.push("id>=u");
        if(this.B) cols.push("id>=b");
        if(this.R) cols.push("id>=r");
        if(this.G) cols.push("id>=g");
        query += `+(${cols.join("+or+")})`
      } 
    } else if(this.C) query += 'c';
    
    // If there are no colour search terms
    if(query === "") return "";
      
    return `(id${this.MatchType}${query})`;
  }

  public ToDictionary(): { [key: string]: any; } {
    return { 'ColourMatchType': this.MatchType, 'colours': this.ToList() };
  }

  public ToList() {
    var list : string[] = [];
    if(this.W) list.push('W');
    if(this.U) list.push('U');
    if(this.B) list.push('B');
    if(this.R) list.push('R');
    if(this.G) list.push('G');
    if(this.C) list.push('C');

    return list;
  }


}

export class RaritySelection extends BaseSelection {
  constructor(public Rarities : string[] = [], public MatchType : string = '=') {
    super();
  }

  public Validate() : boolean { return this.Rarities != undefined; }
  public ToList() : string[] { return this.Rarities; }

  public ToDictionary(): { [key: string]: any; } {
    return { 'RarityMatchType': this.MatchType, 'rarities': this.ToList() };
  }

  public ToScryfallQuery() : string {
    if(!this.Validate() || this.Rarities?.length == 0) return "";
    var query = "";
    query = `(r:${this.Rarities?.join('+or+r:')})`
    
    return query;
  }
}

export class SetSelection extends BaseSelection {
  constructor(public Sets : string[] = [], public MatchType : string = '=') { super(); }
  
  public First() : string {
    if(this.Sets[0])
      return this.Sets[0];

    return "";
  }

  public Validate(): boolean { return this.Sets != undefined; }
  public ToList() : string[] { return this.Sets; }

  public ToDictionary() : { [key: string]: any; } { 
    return { 'SetMatchType' : this.MatchType, 'sets': this.Sets }; 
  }
  
  public ToScryfallQuery() : string { return ""; }
}