const endpointsJson = require("../endpoints.json")
const db = require('../db/connection')

function getApi(req, res) {
    console.log(endpointsJson, "<--------endpoints.json")
    res.status(200).send({endpoints: endpointsJson})   // does not need to interact with model because it is static
}

module.exports = getApi