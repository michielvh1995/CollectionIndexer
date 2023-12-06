import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { MessageService } from '../messages/services/messages.service';
import { Card } from '../models/card';


@Injectable({
  providedIn: 'root'
})
export class ScryfallAPIService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`Scryfall API Service: ${message}`);
  }

  // TODO
  // URL for the API, this needs to be configurable from a config file in the future
  // This URL is specifically for the cards component of the Scryfall API.
  // When we use more of this API (sets, and collection synchronization) we need to change this URL.
  private apiURL = "https://api.scryfall.com/cards/"

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public scryfallListToCards(scryfallData:ScryfallCardListAPIModel) : Card[] {
    var cardsArray : Card[] = [];

    if(!scryfallData.data) return [];

    for (let i = 0; i < scryfallData.data.length; i++)
        cardsArray.push(Card.FromScryfallCard(scryfallData.data[i]));
    
    return cardsArray;
  }

  // Oh dear...
  // De scryfall API heeft veel meer opties dan de MTG.io API.
  // Als gevolg kunnen we veel meer zoektermen toevoegen
  // Supported options:
  // * colors: wubrg/c/m
  // * name
  // * set
  // * type: land, creature, artifact, etc.
  searchForCards(queryString : string) : Observable<Card[]> {
    return this.http.get<ScryfallAPIModel>(`${this.apiURL}search?unique=prints&q=${queryString}`)
    .pipe(
      catchError(this.handleError<ScryfallCardListAPIModel>('Search for cards', {"data": [], "object": "error", "total_cards" : 0})),
      map(res => this.reportScryfallErrorcodes<ScryfallCardListAPIModel>(res, {"data": [], "object": "error", "total_cards" : 0})),
      map(res => this.scryfallListToCards(res))
    );  
  }

  public new_searchForCards(queryString : string, pageNo : number, uniqueType = "prints") : Observable<ScryfallCardListAPIModel> {
    // scryfallQuery =`${this.apiURL}search?unique=prints&page=${pageNo}&q=${queryString}`;
    
    // if(uniqueType) 
    var scryfallQuery =`${this.apiURL}search?unique=${uniqueType}&page=${pageNo}&q=${queryString}`;

    this.log(scryfallQuery);

    return this.http.get<ScryfallAPIModel>(scryfallQuery)
    .pipe(
      catchError(this.handleError<ScryfallCardListAPIModel>('Search for cards', {"data": [], "object": "error", "total_cards" : 0})),
      map(res => this.reportScryfallErrorcodes<ScryfallCardListAPIModel>(res, {"data": [], "object": "error", "total_cards" : 0}))
    );
  }

  // Just get all the information we need from the Scryfall API.
  // This incldues the image and the promotypes array.
  // Later we can send this information to a buffer or to the collecteDB API
  getCardInformation(set_code? : string, number? : string) : Observable<ScryfallCardAPIModel> {
    this.log(`Seached for ${set_code}/${number}`);

    return this.http.get<ScryfallCardAPIModel>(`${this.apiURL}${set_code}/${number}`)
    .pipe(
      catchError(this.handleError<ScryfallCardAPIModel>('getCardInfo')),
      tap(res => this.reportScryfallErrorcodes(res))
    );  
  }

  // Do basic error checking and reporting. 
  // If the object is an error, return a basic response with minimal values
  private reportScryfallErrorcodes<T>(apiResponse : ScryfallAPIModel, result? : T) : T {
    if(apiResponse.object == "error") {
      this.log(`Failed to get cards: ${apiResponse.code}, ${apiResponse.details}`);
      return result as T;
    }
    return apiResponse as T;
  }

  private handleError<T>(operation = 'default operation', result?: T){
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log("Failed to get cards: ");
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

interface ScryfallAPIModel {
  object : string;

  // Error response:
  code? : string;
  status? : number;
  details? : string;
}


export interface ScryfallCardAPIModel extends ScryfallAPIModel {
  id? : string;
  multiverse_ids? : number[];
  cardmarket_id? : number;
  image_uris : { [key:string] : string };
  card_faces?: { image_uris: {[key:string] : string} }[];
  promo_types? : string[];
  finishes : string[];
  name : string;
  set: string;
  collector_number: string;

  color_identity? : string[];
  rarity? : string;
}


export interface ScryfallCardListAPIModel extends ScryfallAPIModel {
  total_cards : number;
  has_more? : boolean;
  next_page? : string;
  data : ScryfallCardAPIModel[];
}


