const { expect } = require('chai');
const knex = require('knex');

const app = require('../src/app');
const items = require('./items.fixtures');

describe('Items endpoints', () => {
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
    describe('GET /api/items', () => {
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
  
        it('GET /items responds with 200 and an array', (done) => {
          return supertest(db)
            .get('/api/items')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(201, items)
            .end(done())
        })
    })
    })

    describe('POST /api/items', () => {
      beforeEach('insert items', () => {
        return db
          .into('items')
          .insert(items)
          
      })

      it('POST /items responds with 400 and an error given a missing required field', (done) => {
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
          .expect(400, { error: `Missing name in request body`})
          .end(done())
          
      })
      it('POST /items responds with 400 and an error given a wrong input for string', (done) => {
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
          .expect(400, { error: `Input name should be of type string`})
          .end(done())          
      })
      it('POST /items responds with 400 and an error given a wrong input for number', (done) => {
        const newItem = {
          id: 33,  
          name: 2,
          date_added: '2019-10-25T08:19:12-07:00',
          section_id: 2, 
          note: 'yum',
          init_quantity: 2, 
          curr_quantity: 'one'
        };
        return supertest(db)
          .post('/api/items')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newItem)
          .expect(400, { error: `Quantity must be an number greater than 0`})
          .end(done())
      })
      it('POST /items responds with a 201 and the new item', (done) => {
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
          .end(done())
      })
    })

    
    describe('DELETE /api/items/:itemId', () => {
      context('given there are no items in the table', () => {
        it('responds with 404 and an an error', () => {
          const itemId = items[0].id

          return supertest(app)
            .delete(`/api/items/${itemId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: `Item does not exist` })
            
        })
      })

      context('given there are items in the table', () => {
        beforeEach('insert items', () => {
          return db
            .into('items')
            .insert(items)
            
        })

        it('responds with 204 only', () => {
          const itemId = items[0].id

          return supertest(app)
            .delete(`/api/items/${itemId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(204)
            
        })
      })
    })

    describe('PATCH /api/items/:itemId', () => {
      const fieldsToUpdate = {
        name: 'Peanut butter'
      }

      context('given there are no items in the table', () => {
        it('responds with 404 and an an error', () => {
          const itemId = items[0].id

          return supertest(app)
            .patch(`/api/items/${itemId}`)
            .send(fieldsToUpdate)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: `Item does not exist` })
            
        })
      })

      context('given there are items in the table', () => {
        beforeEach('insert items', () => {
          return db
            .into('items')
            .insert(items)
            
        })
        
        it('responds with 404 and error given item does not exist', () => {
          const itemId = 200;

          return supertest(app)
            .patch(`/api/items/${itemId}`)
            .send(fieldsToUpdate)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: `Item does not exist` })
            
        })
        it('responds with 400 and error given currQuantity exceeds initQuantity', () => {
          const fieldsToUpdate2 = {
            quantity: 2
          }
          const itemId = items[0].id;

          return supertest(app)
            .patch(`/api/items/${itemId}`)
            .send(fieldsToUpdate2)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(400,  { error: { message: `currQuantity cannot exceed init_quantity` }})
            
        })
        it('responds with 400 and error given no update or empty', () => {
          const fieldsToUpdate3 = {}
          const itemId = items[0].id;

          return supertest(app)
            .patch(`/api/items/${itemId}`)
            .send(fieldsToUpdate3)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(400,  { error: {message: `Request body must contain name, section, note, or updated quantity.`}})
            
        })
        it('responds with 204 only', () => {
          const itemId = items[0].id

          return supertest(app)
            .patch(`/api/items/${itemId}`)
            .send(fieldsToUpdate)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(204)
            
        })
      })
    })
    
  })
})