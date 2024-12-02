// importing dependencies
const express = require('express')


// const db = require('./db//connection')


// express
const app = express()


const {getApi}= require("./controllers/api.controller")
const { getTopics } = require('./controllers/topics.controller')


const {getArticleById} = require('./controllers/article_id.controller')
const {getAllArticles} = require('./controllers/article.controller')
const {getCommentsByArticleId} = require('./controllers/comments.controller')


// middleware
app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.use ((err, req, res, next) => {
   if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
   }
})



app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)



app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        return res.status(err.status).send({msg: err.msg})
    }res.status(500).send({msg: 'Server error'})
})

module.exports = app
