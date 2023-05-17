const express = require("express");
const app = express()
const cors = require('cors')
const port = process.env.PORT || 9999
require('dotenv').config()

// midleware

app.use(cors());
app.use(express.json())


app.get('/', (req, res) =>{
    res.send("welcome to Our Toy Shop")
})

app.listen(port, () =>{
    console.log(`toy server is running on: ${port}`)
})
