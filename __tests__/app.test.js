const request = require("supertest")
const app = require('../app')
const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
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

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object when given the correct article_id", () => {
    const correctArticleId = 1
    return request(app).get(`/api/articles/${correctArticleId}`).expect(200).then(({body: {article}}) => {
      expect(article).toHaveProperty('author')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('article_id', correctArticleId)
      expect(article).toHaveProperty('body')
      expect(article).toHaveProperty('topic')
      expect(article).toHaveProperty('created_at')
      expect(article).toHaveProperty('votes')
      expect(article).toHaveProperty('article_img_url')
    })
  })
  test("404: Responds with error when article_id is not found", () => {
    const incorrectArticleId = 400
    return request(app).get(`/api/articles/${incorrectArticleId}`).expect(404).then(({body}) => {
      expect(body.msg).toBe("Article not found")
    })
  })
  test("400: Responds with bad request error when article_id is incorrect", () => {
    return request(app).get("/api/articles/abcdefg").expect(400).then(({body}) => {
      expect(body.msg).toBe("Bad request")
    })
    
  })
})

