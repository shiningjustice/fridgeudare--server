# Fridg·u·Dare (Server)

This is the backend code for FridgeUDare, a food inventory app designed to reduce food waste. For more information on the app, please visit the client repo. 

- Link to Live App(https://fridgeudare.now.sh/)
- Link to Client Repo(https://github.com/shiningjustice/fridgeudare-client)

## Running the Code

**Prerequisites**
Fridg·u·Dare requires Node.js v10+ to run.

**Installing**
Install the dependencies and devDependencies (`npm install`) to start the server.

**Run Tests**
Run `rum test` in the terminal to run tests.

## DB Schema

**Sections**
```
{
  id: {
    type: Number,
    required: true (generated by default as identity)
  },
  name: {
    type: String, 
    required: true,
  }
}
```

**Items**
```
{
  id: {
    type: Number,
    required: true (generated by default as identity),
  },
  name: {
    type: String,
    required: true,
  },
  date_added: {
    type: Date,
    required: true,
  },
  section_id: {
    type: Number,
    required: true,
    references: sections(id)
  },
  note: {
    type: String,
  },
  init_quantity: {
    type: Number,
  },
  curr_quantity: {
    type: Number, 
  }
}
```

## API Overview
### Items Endpoints
#### `GET /api/items`
Returns all items in database.

Example response: 
```
[
  {
      "id": 12,
      "name": "Oranges",
      "sectionId": 1,
      "dateAdded": "2019-10-28T00:00:00.000Z",
      "note": "Gideon",
      "initQuantity": 1,
      "currQuantity": 1
  },
  {
      "id": 1,
      "name": "bag of mushrooms",
      "sectionId": 2,
      "dateAdded": "2019-10-25T00:00:00.000Z",
      "note": "",
      "initQuantity": 1,
      "currQuantity": 1
  },
  {
      "id": 4,
      "name": "whole wheat bread",
      "sectionId": 3,
      "dateAdded": "2019-10-25T00:00:00.000Z",
      "note": "",
      "initQuantity": 1,
      "currQuantity": 1
  },
  {
      "id": 18,
      "name": "Soy Sauce",
      "sectionId": 7,
      "dateAdded": "2019-10-25T00:00:00.000Z",
      "note": "",
      "initQuantity": 1,
      "currQuantity": 1
  },
  ...
]
```

#### `POST /api/items`
Posts a new item to the database. Item must include name, date added, sectionId, and quantity. The inputted quantity will be added to the `initQuantity` row, which indicates the item's original quantity. This cannot be changed. 

Example request:
```
{
  body: {
    name: "Blueberries",
    dateAdded: "2019-12-17T00:00:00.000Z",
    sectionId: 1,
    quantity: 2,
    note: "small clamshells"
  },
  ...
}
```

Example response: 
```
{
  status: 201,
  json: {
    "id": 29,
    "name": "Blueberries",
    "sectionId": 1,
    "dateAdded": "2019-10-25T00:00:00.000Z",
    "note": "small clamshells",
    "initQuantity": 2,
    "currQuantity": 2
  },
  ...
}
```

#### `DELETE /api/items/:itemId`
Deletes item from database using the id passed into the api call's url.


#### `PATCH /api/items/:itemId`
Allows you to edit an item using the item id provided in the call's url. Returns an `400` error if the updated quantity, which becomes `curr_quantity`, exceeds the `init_quantity`. 

### Sections Endpoints
Instead of assuming the sections were constant, I created a table for them so that functionality for the user to add custom sections would be easy to implement in the future.

#### `GET /api/sections`
Returns all existing sections (item categories, i.e., fruit, vegetables, pantry)

### Results Endpoints
#### `GET /api/sections/results?:queryString`
Returns all items that meet query specifications, including at least search term, sort order, and/or specified filter.

Example of query string: 
```
.../api/sections/results?search=mushrooms&filteredFolders=2&sort=ageOld
```

### Signups Endpoints
#### `POST /api/signup`
Adds contact information for people interested in using the app.

## Tech Stack (Backend)
- Express
- Node
- Knex.js (for PostgreSQL)
- Postgrator
- Mocha, Chai, Supertest

## Author
[Phoebe Law](https://shiningjustice.github.io) 
[@shiningjustice](https://github.com/shiningjustice)
