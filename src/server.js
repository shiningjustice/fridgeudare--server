'use strict'; 

//so that the app is able to reference .env for values(?)
require('dotenv').config;
const knex = require('knex');
const app = require('./app');
const { PORT } = require('./config');

const db = knex({
  client: "pg", 
  connection: process.env.DATABASE_URL
})

app.set('db', db);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));