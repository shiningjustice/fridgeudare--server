const knex = require('knex');

const config = require('../src/config')
const items = require('./items.fixtures')
const app = require('../src/app')

describe.only('results endpoint', () => {
  let db;

  before('create db connection', () => {
    db = knex({
      client: 'pg', 
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db)
    return db;
  });
  
  before('empty db', () => db('items').truncate());
  afterEach('empty db', () => db('items').truncate());
  after('destroy db connection', () => db.destroy());

  describe.only('unauthorized requests', () => {
    const searchTerm = '3'
    const sort = 'ageOld';
    const filteredFolders = [3]

    // getResultsSearchOnly
    it.only(`GET '/api/results?search=:searchTerm' returns 400 unauthorized req`, done => {
      return supertest(db)
        .get(`/api/results?search=${searchTerm}`)
        .expect(400, { error: { message: `Unauthorized request` } })
        .then(done())
    })
    // getResultsSectionsOnly
    it(`GET '/api/results?filteredFolders=:filteredFolders' returns 400 unauthorized req`, done => {
      return supertest(db)
        .get(`/api/results?filteredFolders=${filteredFolders}`)
        .expect(400, { error: { message: `Unauthorized request` } })
        .then(done())
    })
    // getResultsSortOnly
    it(`GET '/api/results?sort=:sort' returns 400 unauthorized req`, done => {
      return supertest(db)
        .get(`/api/results?sort=${sort}`)
        .expect(400, { error: { message: `Unauthorized request` } })
        .then(done())
    })
    // getResultsSearchSections
    it(`GET '/api/results?search=:search&filteredFolders=:filteredFolders' returns 400 unauthorized req`, done => {
      return supertest(db)
        .get(`/api/results?search=${searchTerm}&filteredFolders=${filteredFolders}`)
        .expect(400, { error: { message: `Unauthorized request` } })
        .then(done())
    })
    // getResultsSearchSort
    it(`GET '/api/results?search=:search&sort=:sort' returns 400 unauthorized req`, done => {
      return supertest(db)
        .get(`/api/results?search=${searchTerm}&sort=${sort}`)
        .expect(400, { error: { message: `Unauthorized request` } })
        .then(done())
    })
    // getResultsSectionsSort
    it(`GET '/api/results?filteredFolders=:filteredFolders&sort=:sort' returns 400 unauthorized req`, done => {
      return supertest(db)
        .get(`/api/results?filteredFolders=${filteredFolders}&sort=${sort}`)
        .expect(400, { error: { message: `Unauthorized request` } })
        .then(done())
    })
    // getResultsSearchSectionsSort
    it(`GET '/api/results?search=:search&filteredFolders=:filteredFolders&sort=:sort' returns 400 unauthorized req`, done => {
      return supertest(db)
        .get(`/api/results?search=${searchTerm}&filteredFolders=${filteredFolders}&sort=${sort}`)
        .expect(400, { error: { message: `Unauthorized request` } })
        .then(done())
    })
  })
  
  describe('authorized requests', () => {
    const searchTerm = '3'
    const sort = 'ageOld';
    const filteredFolders = [3]
    const expectedItem = {
      id: 3, 
      name: 'test 3', 
      date_added: new Date('2019-11-08T03:24:00'),
      section_id: 3,
      note: 'test 3: test test test',
      init_quantity: 3, 
      curr_quantity: 2
    }
    const expectedSortAll = [
      {
        id: 4,
        name: 'test 4' ,
        date_added: new Date('2019-11-07T03:24:00'),
        section_id: 4,
        note: 'test 4: test test test test',
        init_quantity: 4, 
        curr_quantity: 4
      },
      {
        id: 3, 
        name: 'test 3', 
        date_added: new Date('2019-11-08T03:24:00'),
        section_id: 3,
        note: 'test 3: test test test',
        init_quantity: 3, 
        curr_quantity: 2
      },
      {
        id: 2,
        name: 'test 2',
        date_added: new Date('2019-11-09T03:24:00'),
        section_id: 2,
        note: 'test 2: test test',
        init_quantity: 2,
        curr_quantity: 1
      },
      {
        id: 1, 
        name: 'test 1',
        date_added: new Date(),
        section_id: 1, 
        note: 'test 1: test',
        init_quantity: 1,
        curr_quantity: 1
      },
    ];

    //response should be same if in empty or if items in db
    context('item missing sort/filter value', () => {
      it(`GET '/api/results?' returns 400 error`, done => {
        return supertest(db)
          .get('/api/results?')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(400, { error: { message: `Request queries must contain search term, folders to filter, and/or sort params.` } })
          .end(done())
      })
    })

    context('nothing in db', () => {
       // getResultsSearchOnly
       it(`GET '/api/results?search=:searchTerm' returns 500`, done => {
        return supertest(db)
          .get(`/api/results?search=${searchTerm}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(500)
          .end(done())
      })
    })

    context('items in db', () => {
      beforeEach('insert items in db', done => {
        return db
          .into('items')
          .insert(items)
          .end(done())
      })
  
      // getResultsSearchOnly
      it(`GET '/api/results?search=:searchTerm' returns 200 and relevant item(s)`, done => {
        return supertest(db)
          .get(`/api/results?search=${searchTerm}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedItem)
          .end(done())
      })
  
      // getResultsSectionsOnly
      it(`GET '/api/results?filteredFolders=:filteredFolders'  returns 200 and relevant item(s)`, done => {
        return supertest(db)
          .get(`/api/results?filteredFolders=${filteredFolders}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedSortAll)
          .end(done())
      })
  
      // getResultsSortOnly
      it(`GET '/api/results?sort=:sort' returns 200 and relevant item(s)`, done => {
        return supertest(db)
          .get(`/api/results?sort=${sort}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedItem)
          .end(done())
      })
  
      // getResultsSearchSections
      it(`GET '/api/results?search=:search&filteredFolders=:filteredFolders' returns 200 and relevant item(s)`, done => {
        return supertest(db)
          .get(`/api/results?search=${searchTerm}&filteredFolders=${filteredFolders}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedItem)
          .end(done())
      })
  
      // getResultsSearchSort
      it(`GET '/api/results?search=:search&sort=:sort' returns 200 and relevant item(s)`, done => {
        return supertest(db)
          .get(`/api/results?search=${searchTerm}&sort=${sort}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedItem)
          .end(done())
      })
  
      // getResultsSectionsSort
      it(`GET '/api/results?filteredFolders=:filteredFolders&sort=:sort' returns 200 and relevant item(s)`, done => {
        return supertest(db)
          .get(`/api/results?filteredFolders=${filteredFolders}&sort=${sort}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedItem)
          .end(done())
      })
  
      // getResultsSearchSectionsSort
      it(`GET '/api/results?search=:search&filteredFolders=:filteredFolders&sort=:sort' returns 200 and relevant item(s)`, done => {
        return supertest(db)
          .get(`/api/results?search=${searchTerm}&filteredFolders=${filteredFolders}&sort=${sort}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedItem)
          .end(done())
      })
    })
  })
});