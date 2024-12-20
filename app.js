// importing dependencies
const express = require('express')
const cors = require('cors');


// const db = require('./db//connection')


// express
const app = express()


const {getApi}= require("./controllers/api.controller")
const { getTopics } = require('./controllers/topics.controller')


const {getArticleById} = require('./controllers/article_id.controller')
const {getAllArticles} = require('./controllers/article.controller')
const {getCommentsByArticleId} = require('./controllers/comments.controller')

const {postCommentForArticle} = require("./controllers/add_comment.controller")
// console.log(postCommentForArticle)

const {patchArticleById} = require("./controllers/update_article_by_id.controller")
const {deleteComment, removeCommentById} = require("./controllers/delete_comment_by_id.controller")


// middleware
app.use(cors());
app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics)



// app.use ((err, req, res, next) => {
//    if(err.status && err.msg) {
//     res.status(err.status).send({msg: err.msg})
//    }
// })



app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentForArticle)
app.patch("/api/articles/:article_id", patchArticleById)
app.delete("/api/comments/:comment_id", removeCommentById)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        return res.status(err.status).send({msg: err.msg})
    }res.status(500).send({msg: 'Server error'})
})

module.exports = app
