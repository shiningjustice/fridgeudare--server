'use strict';  
const app = require('../src/app');

describe('App', () => {
  context('authorized requests', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .set('Authorization', `bearer ${process.env.API_TOKEN}`)
        .expect(200, 'Hello, world!');
    });
  })
});