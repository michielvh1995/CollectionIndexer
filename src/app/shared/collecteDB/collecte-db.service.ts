import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { MessageService } from '../messages/services/messages.service';
import { Card } from '../models/card';

interface CardsAPIModel {
  Cards: Card[];
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

    // TODO
    // URL for the API, this needs to be configurable from a config file in the future
    private apiURL = "http://localhost:8000/"

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // Query the server for all cards, via cards/all. 
    // Might have to update this function to allow for pagination
    getAllCards(): Observable<Card[]> {
      return this.http.get<CardsAPIModel>(`${this.apiURL}cards/all`)
        .pipe(
          catchError(this.handleError<CardsAPIModel>('Get all cards', {"Cards":[]})),
          map(fetched => fetched.Cards),
          tap(fetched => this.log(`Fetched ${fetched.length} cards`)) // Log success
        );
    }
  
    // Query the server for cards with field/constraint pairs as a dictionary
    searchCardsByFieldsValues(parameters : {[field : string]: string}) : Observable<Card[]> {    
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
    searchCardsByField(field:string, value:string) : Observable<Card[]>  {
      return this.http.get<CardsAPIModel>(`${this.apiURL}cards?${field}=${value}`)
        .pipe(
          catchError(this.handleError<CardsAPIModel>('Get cards by internal ID', {"Cards":[]})),
          map(fetched => fetched.Cards), // Extract the cards from the response
          tap(fetched => this.log(`Fetched ${fetched.length} cards`))
        );
    }

    // This function can be used to post a single new card to the server
    postNewCards(cards : Card[]) : Observable<CardsAPIModel> {
      this.log(`Posting ${cards.length} cards`);
      let cardWrapper : CardsAPIModel = {"Cards" : cards };
      
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