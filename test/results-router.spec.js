const expect = require('chai');
const knex = require('knex');

const config = require('../src/config');
const resultsRouter = require('../src/results/results-router');

describe('results endpoints', () => {
  before('connect to db', () => {
    const db = knex ({
      client: 'pg',
      connection: config.TEST_DATABASE_URL
    });
    app.set('db', db);
  });
  beforeEach('clear db', () => db('items').truncate());
  afterEach('clear db', () => db('items').truncate());
  after('destroy db connection', () => db.destroy());
  
})