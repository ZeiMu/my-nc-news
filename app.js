// importing dependencies
const express = require('express')

// const db = require('./db//connection')

// express
const app = express()

const getApi = require("./controllers/api.controller")

const {getArticleById} = require('./controllers/article_id.controller')
const {getAllArticles} = require('./controllers/article.controller')

// middleware
app.use(express.json())

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)



app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        return res.status(err.status).send({msg: err.msg})
    }res.status(500).send({msg: 'Server error'})
})
module.exports = app
