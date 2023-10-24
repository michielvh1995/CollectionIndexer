# CollectionIndexer

This is the Angular2 based front end of the CardIndexer project. This is a project I am working on whilst rehabilitating. The goal of this project is to be able to display my Magic: the Gathering card collection.

I want to be able to both index what I have for myself, and be able to give my friends an easy way to browse my cards for anything they would like to trade/buy from me.

## Components overview
In this project are the following modules:
* The `add-card` module
* The `card-collection-overview` module
* The `card-display` module
* The `card-filter` module
* The `shared` module

The following are still going to be added:
* Create/update decks page
* Decks overview page
* Deck information page

### The add card module
The add card page consists of three components, together building the _Add cards_ page:
1. The `add-card-page` component
2. The `card-search` component
3. The `card-selector` component

The `add-card-page` component creates a single `card-search` component. This component is the search bar with all its filters and the search button.
The search filters are provided by the `card-filter` component, which in turn yields a list of cards when the _Search_ button is pressed 

Each result found on the mtg.io API is displayed as a `card-selector` component. These are the children of the `card-search` component.
Each of these displays the card image, its name and extra finishes of these cards (i.e. oil slick or serialization).

### The card collection page
The card collection page displays all cards I have in my collection.
This is a work in progress

I want to have a collector's overview page, with pages per set. On each of these pages you can see what cards you have of the set and which cards you are missing.

### The card display module
This module is mostly a helper module for the other modules: this module/page handles the display for the individual cards in the other modules.
Here is the logic for rendering the cards and keeping track of their properties. It also contains the logic for flipping cards with multiple faces.

### The card filter module
This module provides a filter to filter cards with. 
The main filter component is the `card-filter` component. This filter can then be extended with the other filters in the component. These are:
* `colour-filter`
* `rarity-filter`

*TODO:* Each filter is an extension of the `base-filter` class, which provides logic for the following functions:
* `Enable() : void`: Enables the component
* `Disable() : void`: Disables the component
* `Validate() : boolean`: Validates whether or not the input is correct
* `ReadData() : Selection`: This function reads the data of the filter and yields s `Selection`-object. The selection object in turn can be used in filtering/searching logic for cards. In case of the `card-filter` component it calls the `ReadData()` functions of the child components as well.

This modules makes extensive use of the filter objects in the `shared/models/filters.js` file.

### The shared module
In the `shared` module we find logic that is used throughout the project:
* The `collecteDB` service: this service provides access to the collecteDB back-end of the project
* The `messages` service: this service provides a tool for logging information. It was introduced as part of the _Tour of Heroes_ tutorial for Angular2
* The `scryfallAPI` service: this service provides access to the Scryfall API, which is used for retrieving card information and images.
* The `wizardsAPI` service: this services is used to access the MTG.io api. *TODO*: this API service is no longer in use.
* And `models`: in this folder there is the logic regarding the models that are used through this project. It contains the logic for the `Selection`-objects and the `Card`-objects.

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
