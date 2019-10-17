const xss = require('xss');
const express = require('express');

const ResultsService = require('./results-service');

const resultsRouter = express.Router();

const serializeItem = item => ({
  id: item.id, 
  name: xss(item.name), 
  sectionId: item.section_id,
  dateAdded: item.date_added,
  note: xss(item.note),
  initQuantity: item.init_quantity,
  currQuantity: item.curr_quantity, 
})

resultsRouter
  .route('')
  .get((req, res, next) => {
    let { search, filteredFolders, sort } = req.query;

    console.log(`in server at start, search = ${search} and filteredFolders = ${filteredFolders} and sort = ${sort}`)
    const nothingFound = { error: `Nothing found for this search. Please try again.`}

    //Check that at least one of the items has a value
    if (!search && !filteredFolders && !sort) {
        return res 
        .status(400)
        .json({
          error: {
            message: `Request queries must contain search term, folders to filter, and/or sort params.`
          }
        })
    }

    //Convert filteredFolders to be parsed to be a number
      //if an object, destringify the params
    if (typeof(filteredFolders) === 'object') {
      filteredFolders = Object.keys(filteredFolders).map(k => JSON.parse(filteredFolders[k]))
    } //If a string, parse but put into an array so the `.whereIn()` knex function can read it
    else if (typeof(filteredFolders) === 'string') {
      filteredFolders = [JSON.parse(filteredFolders)]
    }

    //set variable to add a promise to later (to keep things DRY)
    let resultsServicePromise;
    // set variables for  the sorting feature
    let sortField = 'sortField';
    let sortOrder = 'sortOrder';    
    function getSortVars (sortValue) {    
      if (sortValue === 'ageOld') {
        sortField = 'date_added';
        sortOrder = 'asc';
      } 
      if (sortValue === 'ageNew') {
        sortField = 'date_added';
        sortOrder = 'desc';
      }
      if (sortValue === 'alphaA') {
        sortField = 'name';
        sortOrder = 'asc';
      }
    }

    //search term, sections, and sort
    if (search && filteredFolders && sort) {
      getSortVars(sort);
      resultsServicePromise = ResultsService.getResultsSearchSectionsSort(
        req.app.get('db'),
        search,
        filteredFolders,
        sortField,
        sortOrder,
      )
    }
    //search term and sections (folders)
    if (search && filteredFolders) {
      resultsServicePromise = ResultsService.getResultsSearchSections(
        req.app.get('db'),
        search,
        filteredFolders
      )
    }
    //sections and sort 
    if (filteredFolders && sort) {
      getSortVars(sort);
      resultsServicePromise = ResultsService.getResultsSectionsSort(
        req.app.get('db'),
        filteredFolders,
        sortField,
        sortOrder,
      )
    }
    //search term and sort 
    if (search && sort) {
      getSortVars(sort);
      resultsServicePromise = ResultsService.getResultsSearchSort(
        req.app.get('db'),
        search,
        sortField,
        sortOrder,
      )
    }
    //search term only
    else if (!filteredFolders && !sort) {
      resultsServicePromise = ResultsService.getResultsSearchOnly(
        req.app.get('db'),
        search
      )
    }
    //sections (folders) only
    else if (!search && !sort) {
      resultsServicePromise = ResultsService.getResultsSectionsOnly(
        req.app.get('db'),
        filteredFolders
      )
    }
    //sort only
    else if (!search && ! filteredFolders) {
      getSortVars(sort);
      resultsServicePromise = ResultsService.getResultsSortOnly(
        req.app.get('db'),
        sortField,
        sortOrder
      )
    }

    resultsServicePromise
      .then(items => {
        let returnValue;
        if (items.length === 0) {
          return res
            .status(200)
            .raw
        }
        return res
          .status(200)
          .json(items.map(serializeItem))
      })
      .catch(next)
  })  

module.exports = resultsRouter;