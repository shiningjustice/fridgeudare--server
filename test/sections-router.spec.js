const { expect } = require('chai');
const knex = require('knex');

const config = require('../src/config');
const sectionsRouter = require('../src/sections/sections-router');

describe('sections endpoint', () => {
  before('create db connection', () => {
    db = knex ({
      client: 'pg',
      connection: config.TEST_DATABASE_URL
    });
    app.set('db', db)
  })
  beforeEach('empty db', () => db('sections').truncate());
  afterEach('empty db', () => db('sections').truncate());
  after('destroy db connection', () => db.destroy())
  
})