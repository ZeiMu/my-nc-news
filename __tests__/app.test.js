const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const app = require('../app')
const endpointsJson = require("../endpoints.json");
const testData = require('../db/data/test-data/index')

/* Set up your test imports here */
const request = require('supertest')
const { Pool } = require("pg");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
 return seed(testData)
})

afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics", () => {
    const expectedTopics = [
      { slug: "coding", description: "Code is love, code is life" },
      { slug: "football", description: "FOOTIE!" },
      { slug: "cooking", description: "Hey good looking, what you got cooking?"}
    ];

    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics[0]).toHaveProperty('slug')
        expect(topics[0]).toHaveProperty('description')
      });
  });
  
});
