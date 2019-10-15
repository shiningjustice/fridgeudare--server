const express = require('express');

const SectionsService = require('./sections-service');

const sectionsRouter = express.Router();
const jsonParser = express.json();

sectionsRouter
  .route('/')
  .get((req, res, next) => {
    SectionsService.getSections(
      req.app.get('db')
    )
      .then(sections => res.json(sections))
      .catch(next)
  })

module.exports = sectionsRouter;