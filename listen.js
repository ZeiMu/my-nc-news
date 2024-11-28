// const app = require('../app')

// const {PORT = 3000} = process.env

// app.listen(PORT, () => {
//     console.log("listening on PORT 3000")
// })

const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));