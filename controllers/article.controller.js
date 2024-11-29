const { fetchAllArticles } = require('../article.model');

const getAllArticles = (req, res, next) => {
  const { sort_by = 'created_at', order = 'desc', author, topic } = req.query;

  const sortColumns = ['created_at', 'votes', 'title', 'article_id'];
  const ordering = ['asc', 'desc'];

  if (!sortColumns.includes(sort_by) || !ordering.includes(order)) {
    return res.status(400).send({ msg: 'Bad request' });
  }

  fetchAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      // empty articles
      if (articles.length === 0 && (author || topic)) {
        return res.status(404).send({ msg: `${author ? 'Author' : 'Topic'} not found` });
      }
      
      res.status(200).send({ articles });
    })
    .catch(next); 
};

module.exports = {getAllArticles};
