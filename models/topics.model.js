const db = require('../db/connection')

function fetchAllTopics() {
    return db.query('SELECT slug, description FROM topics').then(({rows}) => rows)
}
module.exports = {fetchAllTopics}