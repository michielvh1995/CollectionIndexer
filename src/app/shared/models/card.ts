export interface Card {
    internal_id?: number;
    name: string;

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

    foil? : boolean;
}

export interface CardsAPIModel {
    Cards : Card[];
}