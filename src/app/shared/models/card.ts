import { ScryfallCardAPIModel } from "../scryfallAPI/scyfall-api.service";

export class Card {
    constructor(
        public name: string,
        public colour : string[] = [],
        public dual_face : boolean = false,
        public versions : CardVersion[],
        public internal_id? : number
        ) {}

    public static FromScryfallCard(scryfallCard : ScryfallCardAPIModel) {        
        var versions = [{
            "card_count": 0,
            "set_code" : scryfallCard.set,
            "number" : scryfallCard.collector_number,
            "rarity" : scryfallCard.rarity,
      
            "promotypes" : scryfallCard.promo_types,
            "possible_finishes" : scryfallCard.finishes
          } as CardVersion];
        
          var dualface = false;
        
        if(scryfallCard.image_uris)
            versions[0].image_url = scryfallCard.image_uris["normal"];
        else if(scryfallCard.card_faces) {
            dualface = true;
            versions[0].image_url = scryfallCard.card_faces[0]["image_uris"]["normal"];
            versions[0].backside_image = scryfallCard.card_faces[1]["image_uris"]["normal"];
        }

        return new Card(
            scryfallCard.name!, 
            scryfallCard.color_identity!,
            dualface,
            versions
        )
    }
}

export interface CardVersion {
    card_count: number;
    set_code? : string;
    number? : string;
    finish? : string;
    rarity? : string;

    multiverseID?: number;

    // This is information regarding the cards themselves
    location? : string;

    // TODO: Replace foil with the finish
    foil? : boolean;
    
    // Extra annotation
    image_url? : string;
    backside_image? : string;
    promotypes? : string[];
    possible_finishes? : string[];
}

export interface CardsAPIModel {
    Cards : Card[];
}