export class CardSelection {
    public Colours? : ColourSelection;
    public Name? : string;
    public StrictName : boolean = false;
    public Setname? : string;
    public PageNo? : number;
  
    constructor(name? : string, strictName?: boolean, set? : string, colourFilter? : ColourSelection, page? : number) {
      this.Colours = colourFilter;
      this.Name = name;
      this.Setname = set;
      this.PageNo = page;

      if(strictName != undefined)
        this.StrictName = strictName;
    }
    
    // TODO: Move this to the Scryfall API?
    public GenerateScryfallQuery() : string {
      var query: string = "";
      
      if(this.Name)
        if(this.StrictName)
          query+= `name:"${this.Name}"`;
        else
          query+= `name:${this.Name}`;
      
      if(this.Setname) query += `+set:${this.Setname}`;
      if(this.Colours) query += `+${this.Colours.ToScryfallQuery()}`;
      return query;
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
  }
  