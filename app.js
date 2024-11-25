// importing dependencies
const express = require('express')

// const db = require('./db//connection')

// express
const app = express()

const getApi = require("./controllers/api.controller")

// middleware
app.use(express.json())

app.get('/api', getApi)

module.exports = app
