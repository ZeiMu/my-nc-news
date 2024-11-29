const { fetchArticleById } = require("../models/article_id.model");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if (typeof article_id !== "string" || isNaN(Number(article_id))) {
    return next({ status: 400, msg: "Bad request" });
  }

  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return next({ status: 404, msg: "Article not found" });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next({ status: 500, msg: "Server error" });
    });
};
module.exports = { getArticleById };
