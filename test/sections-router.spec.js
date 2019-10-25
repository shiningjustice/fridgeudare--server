const { expect } = require('chai');
const knex = require('knex');

const config = require('../src/config');
const sections = require('./sections.fixtures');
const app = require('../src/app')

describe('sections endpoint', () => {
  before('create db connection', () => {
    db = knex ({
      client: 'pg',
      connection: config.TEST_DATABASE_URL
    });
    app.set('db', db)
  })
  after('destroy db connection', () => db.destroy())
  
  //can't truncate before and after per it referenced in other tables
  context('unauthorized requests', () => {
    describe('GET /api/sections', () => {
      it('responds with a 401 Unauthorized', (done) => {
        return supertest(db)
          .get('/api/sections')
          .expect(401, { error: `Unauthorized request` })
          .end(done())
      })
    })
  })
  context('authorized requests', () => {
    describe('GET /api/sections', () => {
      context('given there are sections in the table', () => {
        it('responds with a 200 and the sections', (done) => {
          return supertest(db)
            .get('/api/sections')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, sections)
            .end(done())
        })
      })
    })
  })
})