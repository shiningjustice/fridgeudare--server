const expect = require('chai');
const knex = require('knex');
const app = require('../src/app');

const config = require('../src/config');
const items = require('./items.fixtures');

describe('results endpoints', () => {
  let db;

  before('connect to db', () => {
    db = knex ({
      client: 'pg',
      connection: config.TEST_DATABASE_URL
    });
    app.set('db', db);
  });
  beforeEach('clear db', () => db('signups').truncate());
  afterEach('clear db', () => db('signups').truncate());
  after('destroy db connection', () => db.destroy());
  
  describe('POST /signups', () => {
    it('returns an error message if a required input is missing', () => {
      const newSignup = {
        name: '',
        email: 'imjoe@schmoe.com'
      }
      console.log(process.env.API_TOKEN);
      return supertest(db)
        .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
        .post('/api/signups')
        .send(newSignup)
        .expect(404, { error: `Missing name in request body` })
    });

    it('returns an error message if input is the wrong type', () => {
      const newSignup = {
        name: 1, 
        email: 'imjoe@schmoe.com'
      }

      return supertest(db)
        .post('/api/signups')
        .send(newSignup)
        .expect(404, { error: `Name must be type string` })
    });

    it('creates the signup entry and returns only a 201 status', () => {
      const newSignup = items[1];

      return supertest(db)
        .post('/')
        .send(newSignup)
        .expect(201)
    })

  })
})