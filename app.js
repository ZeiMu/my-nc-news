// importing dependencies
const express = require('express')


// express
const app = express()

const {getApi}= require("./controllers/api.controller")
const { getTopics } = require('./controllers/topics.controller')

// middleware
app.use(express.json())

app.get('/api', getApi)
app.get('/api/topics', getTopics)

app.use ((err, req, res, next) => {
   if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
   }
})

module.exports = app
