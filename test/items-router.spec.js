const { expect } = require('chai');
const knex = require('knex');

const app = require('../src/app');
const items = require('./items.fixtures');

describe.only('Items endpoints', () => {
  let db;

  before('make a knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db)
  });
  beforeEach('empty db', () => db('items').truncate());
  afterEach('empty db', () => db('items').truncate());
  after('disconnect from db', () => db.destroy());


  // describe('unauthorized requests', () => {
  //   it(`GET /items responds with 401 Unauthorized`, () => {
  //     return supertest(db)
  //       .get('/api/items')
  //       .expect(401, { error: `Unauthorized request` })
  //   })
  //   it(`POST /items responds with 401 Unauthorized`, () => {
  //     return supertest(db)
  //       .post('/api/items')
  //       .send(items[0])
  //       .expect(401, { error: `Unauthorized request` })
  //   })
  //   it(`GET /items/:itemId responds with 401 Unauthorized`, () => {
  //     return supertest(db)
  //       .get('/api/items/${items[0].id}')
  //       .expect(401, { error: `Unauthorized request` })
  //   })
  //   it(`DELETE /items/:itemId responds with 401 Unauthorized`, () => {
  //     return supertest(db)
  //       .delete('/api/items')
  //       .expect(401, { error: `Unauthorized request` })
  //   })
  //   it(`PATCH /items/:itemId responds with 401 Unauthorized`, () => {
  //     return supertest(db)
  //       .patch('/api/items')
  //       .expect(401, { error: `Unauthorized request` })
  //   })
  // })

  context('authorized requests', () => {
    context('given there are no items in the table', () => {
      it('GET /items responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/api/items')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('given there are items in the table', () => {
      beforeEach('insert items', () => {
        return db
          .into('items')
          .insert(items)
      })

      it('GET /items responds with 200 and an array', () => {
        return supertest(db)
          .get('/api/items')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(201, items)
      })

      it('POST /items responds with 400 and an error given a missing required field', () => {
        const newItem = {
          id: 33,  
          date_added: '2019-10-25T08:19:12-07:00',
          section_id: 2, 
          note: 'yum',
          init_quantity: 2, 
          curr_quantity: 1
        };
        return supertest(db)
          .post('/api/items')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newItem)
          .expect(400, items)
      })
      it('POST /items responds with 400 and an error given a wrong input for string', () => {
        const newItem = {
          id: 33,  
          name: 2,
          date_added: '2019-10-25T08:19:12-07:00',
          section_id: 2, 
          note: 'yum',
          init_quantity: 2, 
          curr_quantity: 1
        };
        return supertest(db)
          .post('/api/items')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newItem)
          .expect(400)
      })
      it('POST /items responds with a 200 and the new item', () => {
        const newItem = {
          id: 33,  
          name: 'blueberries',
          date_added: '2019-10-25T08:19:12-07:00',
          section_id: 2, 
          note: 'yum',
          init_quantity: 2, 
          curr_quantity: 1
        };
        return supertest(db)
          .post('/api/items')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newItem)
          .expect(201, newItem)
      })
    })   
  })
})