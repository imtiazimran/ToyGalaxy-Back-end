const express = require("express");
const app = express()
const cors = require('cors')
const port = process.env.PORT || 9999
require('dotenv').config()

// midleware

app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.5ujci4u.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const DB = client.db('toyGalaxy')
    const allToys = DB.collection('toyCollection')
    const addedToys = DB.collection('addedToys')



    app.post('/insertItem', async (req, res) =>{
      const addToy = req.body
     const result =  await addedToys.insertOne(addToy)
     res.send(result)
    })

    app.get('/insertItem', async (req, res) =>{
      const result = await addedToys.find().toArray()
      res.send(result)
    })
    


    app.get('/allToys', async(req, res) =>{
        const result = await allToys.find().toArray()
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) =>{
    res.send("welcome to Our Toy Shop")
})

app.listen(port, () =>{
    console.log(`toy server is running on: ${port}`)
})
