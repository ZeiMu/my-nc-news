const db = require('./db/connection');

const fetchAllArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {
  const sortColumns = ['created_at', 'votes', 'title', 'article_id'];
  const ordering = ['asc', 'desc'];

  if (!sortColumns.includes(sort_by) || !ordering.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid sort_by or order value',
    });
  }


  let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
`;

  
  const queryParams = []


  if (author) {
    sqlQuery += `WHERE articles.author = $${queryParams.length + 1} `
    queryParams.push(author)
  }

  if (topic) {
    if (queryParams.length > 0) {
      sqlQuery += `AND articles.topic = $${queryParams.length + 1} `
    } else {
      sqlQuery += `WHERE articles.topic = $${queryParams.length + 1} `
    }
    queryParams.push(topic)
  }

  sqlQuery += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
  `;


  return db
    .query(sqlQuery, queryParams).then(({rows}) => rows).catch((err) => {
      console.error('error:', err)  
      return Promise.reject({
        status: 500,
        msg: 'Server error',
      });
    });
};

module.exports = {fetchAllArticles}