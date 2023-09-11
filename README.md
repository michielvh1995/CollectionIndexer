# CollectionIndexer

This is the Angular2 based front end of the CardIndexer project. This is a project I am working on whilst rehabilitating. The goal of this project is to be able to display my Magic: the Gathering card collection.

I want to be able to both index what I have for myself, and be able to give my friends an easy way to browse my cards for anything they would like to trade/buy from me.

## Components overview
In this project are the following components:
* The add card page
* The card collection page

The following are still going to be added:
* Create/update decks page
* Decks overview page
* Deck information page

### The add card page
The add card page consists of three components:
1. The `add-card-page` component
2. The `select-card-versions` component
3. The `card-selector` component

The `add-card-page` component creates multiple `select-card-versions` components. 
These are used to search and select the cards to be added.

Each result found on the mtg.io API is displayed as a `card-selector` component. These are the children of the `select-card-versions` component.
Each of these displays the card image, its name and extra finishes of these cards (i.e. oil slick or serialization).

### The card collection page
The card collection page displays all cards I have in my collection.
This is a work in progress

I want to have a collector's overview page, with pages per set. On each of these pages you can see what cards you have of the set and which cards you are missing.


# Angular2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
