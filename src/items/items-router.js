const path = require('path');
const express = require('express');
const xss = require('xss');

const ItemsService = require('./items-service');

const itemsRouter = express.Router();
const jsonParser = express.json();

//serializes item for client
const processItem = item => ({
  id: item.id, 
  name: xss(item.name), 
  sectionId: item.section_id,
  dateAdded: item.date_added,
  note: xss(item.note),
  initQuantity: item.init_quantity,
  currQuantity: item.curr_quantity, 
})

itemsRouter
  .route('/')
  .get((req, res, next) => {
    ItemsService.getItems(
      req.app.get('db')
    )
      .then(items => {
        res.json(items.map(processItem))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, sectionId, quantity, note } = req.body;

    //Check that the required fields have values
    const newItem = {
      name, 
      section_id: sectionId,
      init_quantity: quantity
     };

    for(const [key, value] of Object.entries(newItem)) {
      if (!value) {
        return res.status(404).json({ error: `Missing ${key} in request body`})
      }
    }

    //Add optional fields back to newItem
    newItem.note = note;
    //Set curr_quantity equal to init_quantity
    newItem.curr_quantity = quantity;


    //Check that they are the right type of values
    let strings = [name, note];
    let integers = [quantity]; 

    strings.forEach(string => {
      if (typeof(string) !== 'string') {
        return res.status(400).json({ error: `Missing ${string} in request body`})
      }
    })
    integers.forEach(integer => {
      if (typeof(JSON.parse(integer)) !== 'number' || (JSON.parse(integer)) <= 0) {
        return res.status(400).json({ error: `Quantity must be an number greater than 0`})
      }
    })

    ItemsService.insertItem(
      req.app.get('db'),
      newItem
    )
      .then(item => {
        res
          .status(201)
          //No location provided per no existing 'getById point' 
          .json(processItem(item))
      })
      .catch(next);  
    })

itemsRouter
  .route('/:itemId')
  .all((req, res, next) => {
    ItemsService.getById(
      req.app.get('db'),
      req.params.itemId
    )
      .then(item => {
        if (!item) {
          return res.status(404).json({ error: `Item does not exist` })
        }
        res.item = item
        next();
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    ItemsService.deleteItem(
      req.app.get('db'),
      req.params.itemId
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next);
  })

module.exports = itemsRouter;
