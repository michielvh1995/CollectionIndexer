export interface Card {
    internal_id?: number;
    name: string;
    dual_face: boolean;

    versions : CardVersion[];
}

export interface CardVersion {
    card_count: number;
    set_code? : string;
    number? : string;
    finish? : string;

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