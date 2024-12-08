const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const { Pool } = require("pg");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

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
      {
        slug: "cooking",
        description: "Hey good looking, what you got cooking?",
      },
    ];

    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics[0]).toHaveProperty("slug");
        expect(topics[0]).toHaveProperty("description");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object when given the correct article_id", () => {
    const correctArticleId = 1;
    return request(app)
      .get(`/api/articles/${correctArticleId}`)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id", correctArticleId);
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("404: Responds with error when article_id is not found", () => {
    const incorrectArticleId = 400;
    return request(app)
      .get(`/api/articles/${incorrectArticleId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Responds with bad request error when article_id is incorrect", () => {
    return request(app)
      .get("/api/articles/abcdefg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles sorted by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles[0]).toHaveProperty("article_id");
        expect(articles[0]).toHaveProperty("title");
        expect(articles[0]).toHaveProperty("author");
        expect(articles[0]).toHaveProperty("topic");
        expect(articles[0]).toHaveProperty("created_at");
        expect(articles[0]).toHaveProperty("votes");
        expect(articles[0]).toHaveProperty("article_img_url");
        expect(articles[0]).toHaveProperty("comment_count");
      });
  });
  test("200: Responds with articles depending on topic name", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("404: Responds with an error of not found for topic", () => {
    return request(app)
      .get("/api/articles?topic=abcdetopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for a certain article_id", () => {
    const correctArticleId = 1;
    return request(app)
      .get(`/api/articles/${correctArticleId}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id", correctArticleId);
        });
      });
  });
  test("404: Responds with an error if the article_id does not exist", () => {
    const incorrectArticleId = 1000;
    return request(app)
      .get(`/api/articles/${incorrectArticleId}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Responds with a bad request error when article_id is not a valid number", () => {
    return request(app)
      .get("/api/articles/abcdefg/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Successfully add a comment to an article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
    }
    return request(app).post("/api/articles/9/comments").send(newComment).expect(201).then(({body: {comment}}) => {
      expect(comment).toHaveProperty("author", newComment.username)
      expect(comment).toHaveProperty("body", newComment.body)
    })
  })
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("Succesfully updates the votes for a valid article", () => {
      const correctArticleId = 1
      const incVotes = 10

      return request(app).patch(`/api/articles/${correctArticleId}`).send({inc_votes: incVotes}).expect(200).then(({body: {article}}) => {
        expect(article).toHaveProperty("article_id", correctArticleId)
        expect(article).toHaveProperty("votes", 110)
      })
    })
    test("400: Responds with bad request error if inc_votes is not a number", () => {
      const correctArticleId = 1 

      return request(app).patch(`/api/articles/${correctArticleId}`).send({inc_votes: "not a number"}).expect(400).then(({body}) => {
        expect(body.msg).toBe("Bad request: inc_votes not a number")
      })
    })
    test("404: Responds with an error if article does not exist", () => {
      const incorrectArticleId = 1000
      const incVotes = 9

      return request(app).patch(`/api/articles/${incorrectArticleId}`).send({inc_votes: incVotes}).expect(404).then(({body}) => {
        expect(body.msg).toBe("Article not found")
      })
    })
  })
  
 



