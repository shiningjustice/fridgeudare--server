'use strict';  
const app = require('../src/app');

describe('App', () => {
  context('unauthorized requests', () => {
    it (`given no authToken, it responds with 401 Unauthorized for GET /`, () => {
      return supertest(app)
        .get('/')
        .expect(401, { error: `Unauthorized request` })
    })
    it (`given wrong authToken, it responds with 401 Unauthorized for GET /`), () => {
      const wrongAuthToken = '8479b1e7-2fad-49a4-9583-137ffb811f58'
      return supertest(app)
        .set('Authorization', `Bearer ${wrongAuthToken}`)
        .get('/')
        .expect(401, { error: `Unauthorized request` })
    }
  })

  context('authorized requests', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .set('Authorization', `bearer ${process.env.API_TOKEN}`)
        .expect(200, 'Hello, world!');
    });
  })
});