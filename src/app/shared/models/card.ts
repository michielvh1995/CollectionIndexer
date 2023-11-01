export interface Card {
    internal_id?: number;
    name: string;
    dual_face: boolean;

    versions : CardVersion[];
}

export interface CardVersion {
    card_count: number;

    // These are the properties maintained by wizards of the coast
    multiverseID?: number;
    set_code? : string;
    number? : string;

    // This is information regarding the cards themselves
    location? : string;

    // TODO: Replace foil with the finish
    foil? : boolean;
    finish? : string;
    
    // Extra annotation
    image_url? : string;
    backside_image? : string;
    promotypes? : string[];
    possible_finishes? : string[];
}

export interface CardsAPIModel {
    Cards : Card[];
}