import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScyfallAPIService {

  constructor() { }
}


interface ScryfallCardAPIModel {
  object : string;

  // Error response:
  code? : string;
  status? : number;
  details? : string;

  // Success response:
  id? : string;
  multiverse_ids? : number[];
  cardmarket_id? : number;
  image_uris? : { [key:string] : string };
  promo_types? : string[];
}