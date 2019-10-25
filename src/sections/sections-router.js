const express = require('express');

const SectionsService = require('./sections-service');
const sectionsRouter = express.Router();

sectionsRouter
  .route('/')
  .get((req, res, next) => {
    SectionsService.getSections(
      req.app.get('db')
    )
      .then(sections => {
        res.status(200).json(sections)
      })
      .catch(next)
  })

module.exports = sectionsRouter;