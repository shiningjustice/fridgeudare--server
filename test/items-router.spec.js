const { expect } = require('chai');
const knex = require('knex');

const app = require('../src/app');
const config = require('../src/config');

describe.only('Items endpoints', () => {
  let db;

  before('make a knex instance', () => {
    db = knex({
      client: 'pg',
      connection: config.TEST_DATABASE_URL
    });
    app.set('db', db)
  });
  beforeEach('empty db', () => db('items').truncate());
  afterEach('empty db', () => db('items').truncate());
  after('disconnect from db', () => db.destroy());

  describe('unauthorized requests', () => {
    it (`responds with 401 Unauthorized for GET /bookmarks`, () => {
      return supertest(app)
        .get('/')
        .expect(401, { error: `Unauthorized request to path: ${req.path}` })
    })
  })

})