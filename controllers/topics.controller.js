// const db = require('../db/connection')
// const topicData = require('./data/topics')
const {fetchAllTopics} = require('../models/topics.model')

function getTopics(req, res, next) {
    // console.log("------------Request received at api topics")
   return db.query('SELECT * FROM topics').then(({rows}) => {
    console.log("Database res", rows)
        res.status(200).send({topics: rows})
    })
    .catch(err => {
        next({status: 500, msg: 'Internal server error'})
    })
    }
module.exports = {getTopics}