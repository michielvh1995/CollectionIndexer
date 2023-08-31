import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { MessageService } from '../messages/services/messages.service';
import { APICard, CardVersion } from '../models/api';

import { Card } from '../models/card';


interface CardsAPIModel {
  Cards: APICard[];
}

@Injectable({
  providedIn: 'root'
})
export class CollecteDBService  {
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    private log(message: string) {
      this.messageService.add(`CollecteDB API Service: ${message}`);
    }

    // URL for the API, this needs to be configurable from a config file in the future
    private apiURL = "http://localhost:8000/"

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    // Turn a card from the old card model into the new one, as used by the API
    packAPICard(card : Card) : APICard {
      let version : CardVersion = {
        "card_count": card.card_count,
        "multiverseID" : card.multiverseID,
        "set_code" : card.set_code,
        "foil" : card.foil
      };
      
      this.log(`version cc: ${version.card_count}`);

      return {
        "internal_id" : card.internal_id,
        "name" : card.name,
        "versions" : [version]
      };
    }

    // Unpack function to convert the APICard model to the regular card model. 
    // In other words it turns the APICard model into a list of Cards.
    // Each version of the card becomes its own card here
    unpackAPICard(card : APICard) : Card[] {
      var unpacked : Card[] = []
      for (let index = 0; index < card.versions.length; index++) {
        const version = card.versions[index];
        unpacked.push({
          "internal_id" : card.internal_id,
          "name": card.name,
          "card_count": version.card_count,
          "multiverseID" : version.multiverseID,
          "set_code" : version.set_code,
          "foil" : version.foil,
          "number": version.number
        });
      }
      return unpacked as Card[];
    }

    // This function turns the response of the API into a list of cards.
    // This is done using the unpackAPICard function as helper function
    // the CardsAPIModel contains a list of Cards in the API format, 
    //   which in turn has a bunch of versions
    unpackCardAPIModel(cards : CardsAPIModel) : Card[] {
      var cardsArray : Card[] = [];
      for (let index = 0; index < cards.Cards.length; index++) {
        cardsArray = cardsArray.concat(this.unpackAPICard(cards.Cards[index]));
      }
      return cardsArray;
    }

    // Query the server for all cards, via cards/all. 
    // Might have to update this function to allow for pagination
    getAllCards(): Observable<Card[]> { 
      return this.http.get<CardsAPIModel>(`${this.apiURL}cards/all`)
        .pipe(
          catchError(this.handleError<CardsAPIModel>('Get all cards', {"Cards":[]})),
          map(fetched => this.unpackCardAPIModel(fetched)),
          tap(fetched => this.log(`Fetched ${fetched.length} cards`)) // Log success
        );
    }
  
    // Query the server for cards with field/constraint pairs as a dictionary
    searchCardsByFieldsValues(parameters : {[field : string]: string}) {    
      // First we build up the query string based on the field-value pairs; so it becomes:
      // ?field1=valu1e&field2=value2&
      var queryString = `?`
      for (const key in parameters) {
        if (Object.prototype.hasOwnProperty.call(parameters, key)) {
          queryString += `${key}=${parameters[key]}&`;
        }
      }

      // And then we query the server, with the query string
      return this.http.get<CardsAPIModel>(`${this.apiURL}cards${queryString}`)
        .pipe(
          catchError(this.handleError<CardsAPIModel>('Get cards by internal ID', {"Cards":[]})),
          map(fetched => fetched.Cards),  // Extract the fetched cards
          tap(fetched => this.log(`Fetched ${fetched.length} cards`)) // Log success
        );
    }

    // Query the server on a single field with a value
    searchCardsByField(field:string, value:string) {
      return this.http.get<CardsAPIModel>(`${this.apiURL}cards?${field}=${value}`)
        .pipe(
          catchError(this.handleError<CardsAPIModel>('Get cards by internal ID', {"Cards":[]})),
          map(fetched => fetched.Cards[0]), // Extract the cards from the response
          tap(fetched => this.log(`Fetched ${fetched.name}`))
        );
    }

    // Query the server for a card on its internalID.
    // I do not like this function as the card name is the primary UID
    getCardbyInternalID(internalID : number): Observable<Card>{
      return this.http.get<CardsAPIModel>(`${this.apiURL}cards?internal_id=${internalID}`)
        .pipe(
          catchError(this.handleError<CardsAPIModel>('Get cards by internal ID', {"Cards":[]})),
          map(fetched => this.unpackCardAPIModel(fetched)[0]), // Extract the cards from the response
          tap(fetched => this.log(`Fetched ${fetched.name}`))
        );
    }

    // Update the server for a card on its internalID.
    // I do not like this function as the card name is the primary UID
    updateCardbyID(internalID : number, newValues : Card) : Observable<any> {
      return this.http.put(`${this.apiURL}cards/updatebyID/${internalID}`, newValues, this.httpOptions ).pipe(
        catchError(this.handleError<any>('Update card')),
        tap(response => this.log(`Updated ${internalID} on fields: ${response["updated"]}`))
      );
    }

    // This function can be used to post a single new card to the server
    postNewCard(card : APICard) : Observable<CardsAPIModel> {
      this.log(`Card to be posted: ${card.name}`);
      let cardWrapper : CardsAPIModel = {"Cards" : [card] };
      
      return this.http.post<CardsAPIModel>(`${this.apiURL}cards/new/`, cardWrapper, this.httpOptions).pipe(
        map(newCards => newCards.Cards[0]),
        tap(newCards => this.log(`Added ${newCards.name} with ID ${newCards.internal_id}`)),
        catchError(this.handleError<any>('PostNewCard'))
      );
    }

    // This function can be used to post a single new card to the server
    postNewCards(cards : APICard[]) : Observable<CardsAPIModel> {
      this.log(`Posting ${cards.length} cards`);
      let cardWrapper : CardsAPIModel = {"Cards" : cards };


      console.log("POSTING FROM THE COLLECTEDBSERVICE:");
      console.log(JSON.stringify(cardWrapper));

      
      return this.http.post<CardsAPIModel>(`${this.apiURL}cards/new/`, cardWrapper, this.httpOptions).pipe(
        map(newCards => newCards.Cards),
        tap(newCards => this.log(`Added ${newCards.length} cards`)),
        catchError(this.handleError<any>('PostNewCards'))
      );
    }

    private handleError<T>(operation = 'default operation', result?: T){
      return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
}