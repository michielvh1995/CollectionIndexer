import { ScryfallCardAPIModel } from "../scryfallAPI/scyfall-api.service";

export class Card {
    public missing : boolean = false;

    constructor(
        public name: string,
        public colour : string[] = [],
        public dual_face : boolean = false,
        public versions : CardVersion[],
        public internal_id? : number
        ) {}
    
    
    public static FromScryfallCard(scryfallCard : ScryfallCardAPIModel) {        
        var versions : CardVersion[] = [];

        // Only keep the first character, if the field is not empty
        var rarity = scryfallCard.rarity;
        if(rarity) rarity = rarity[0];
        
        var dualface = false;
        var image_url;
        var backside_image;
        
        if(scryfallCard.image_uris)
            image_url = scryfallCard.image_uris["normal"];
        else if(scryfallCard.card_faces) {
            dualface = true;
            image_url = scryfallCard.card_faces[0]["image_uris"]["normal"];
            backside_image = scryfallCard.card_faces[1]["image_uris"]["normal"];
        }

        // Hacky way to add the card finishes
        if(scryfallCard.finishes) {
            for (let finish = 0; finish < scryfallCard.finishes.length; finish++) {
                versions.push({
                    "card_count": 0,
                    "set_code" : scryfallCard.set,
                    "number" : scryfallCard.collector_number,
                    "finish" : scryfallCard.finishes[finish],
                    "rarity" : rarity,
                    "image_url" : image_url,
                    "backside_image" : backside_image,
            
                    "promotypes" : scryfallCard.promo_types,
                    "possible_finishes" : scryfallCard.finishes
                } as CardVersion);
            }
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
    set_code : string;
    number : string;
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