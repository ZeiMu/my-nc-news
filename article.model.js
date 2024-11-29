const db = require('./db/connection');
const fetchAllArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {
  
const sortColumns = ['created_at', 'votes', 'title', 'article_id'];
const ordering = ['asc', 'desc'];

  if (!sortColumns.includes(sort_by) || !ordering.includes(order)) {
    return Promise.reject({
      status: 400, msg: 'Incorrect sort_by/order value',
    });
  }

let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.topic, 
           articles.created_at, articles.votes, articles.article_img_url, 
           COUNT(comments.comment_id) comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;

let array = [];

  if (author) {
    array.push(`articles.author = '${author}'`);
  }

  if (topic) {
    array.push(`articles.topic = '${topic}'`);
  }

  if (array.length > 0) {
    sqlQuery += ' WHERE ' + array.join(' AND ');
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(sqlQuery).then(({ rows }) => rows).catch((err) => {
      console.error('Error fetching articles:', err);
      return Promise.reject({
        status: 500, msg: 'Server error',
      });
    });
};

module.exports = {fetchAllArticles}