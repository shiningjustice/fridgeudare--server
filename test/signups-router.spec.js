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
  
  describe('POST /signups', (done) => {
    it('returns an error message if a required input is missing', (done) => {
      const newSignup = {
        name: '',
        email: 'imjoe@schmoe.com'
      }
      return supertest(db)
        .post('/api/signups')
        .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
        .send(newSignup)
        .expect(404, { error: `Missing name in request body` })
        .end(done())
    });

    it('returns an error message if input is the wrong type', (done) => {
      const newSignup = {
        name: 1, 
        email: 'imjoe@schmoe.com'
      }

      return supertest(db)
        .post('/api/signups')
        .send(newSignup)
        .expect(404, { error: `Name must be type string` })
        .end(done())
    });

    it('creates the signup entry and returns only a 201 status', (done) => {
      const newSignup = items[1];

      return supertest(db)
        .post('/')
        .send(newSignup)
        .expect(201)
        .end(done())
    })

  })
})