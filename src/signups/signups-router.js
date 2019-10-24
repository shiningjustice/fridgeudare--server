const express = require('express');

const SignupsService = require('./signups-service');
const logger = require('../logger');

const signupsRouter = express.Router();
const jsonParser = express.json();

signupsRouter
  .route('/')
  .post(jsonParser, (req, res, next) => {
    const { name, email } = req.body;
    const newSignup = { name, email }

    for(const [key,value] of Object.entries(newSignup)) {
      if (!value) {
        logger.error(`No key in request body`)
        return res.status(404).json({ error: `Missing ${key} in request body`})
      }
      if (typeof(value) != 'string') {
        logger.error(`Key in req.body is not type string`)
        res.status(400).json({ error: `${key} must be type string`});
      }
    }
    
    SignupsService.insertSignup(
      req.app.get('db'),
      newSignup
    )
      .then(() => 
        res.status(201).end()
      )
      .catch(next);
  })

module.exports =  signupsRouter;