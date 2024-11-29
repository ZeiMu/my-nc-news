const request = require("supertest")
const app = require('../app')
const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")


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
describe("GET /api/articles", () => {
  test('200: Responds with an array of articles sorted by date descending', () => {
    return request(app).get('/api/articles').expect(200).then(({body:{articles}}) => {
      expect(Array.isArray(articles)).toBe(true)
      expect(articles[0]).toHaveProperty('article_id')
      expect(articles[0]).toHaveProperty('title')
      expect(articles[0]).toHaveProperty('author')
      expect(articles[0]).toHaveProperty('topic')
      expect(articles[0]).toHaveProperty('created_at')
      expect(articles[0]).toHaveProperty('votes')
      expect(articles[0]).toHaveProperty('article_img_url')
      expect(articles[0]).toHaveProperty('comment_count')
    })
  })
  test('200: Responds with articles depending on topic name', () => {
    return request(app).get('/api/articles?topic=cats').expect(200).then(({body: {articles}}) => {
      articles.forEach((article) => {
        expect(article.topic).toBe('cats')
      })
    })
  })
  test('404: Responds with an error of not found for topic', () => {
    return request(app).get('/api/articles?topic=abcdetopic').expect(404).then(({body}) => {
      expect(body.msg).toBe('Topic not found')
    })
  })
})