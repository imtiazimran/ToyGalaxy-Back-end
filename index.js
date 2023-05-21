const express = require("express");
const app = express()
const cors = require('cors')
const port = process.env.PORT || 9999
require('dotenv').config()

// midleware

app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // await client.connect();

    const DB = client.db('toyGalaxy')
    const allToys = DB.collection('toyCollection')
    const addedToys = DB.collection('addedToys')



    app.post('/insertItem', async (req, res) => {
      const addToy = req.body
      const result = await addedToys.insertOne(addToy)
      res.send(result)
    })

    app.get('/insertItem/:limit', async (req, res) => {
      const limit = req.params.limit
      let result;
      if (limit === "All") {
        result = await addedToys.find().toArray()

      } else {
        result = await addedToys.find().limit(parseInt(limit)).toArray()
      }
      res.send(result)
    })

    app.get('/insertItem/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addedToys.findOne(query)
      res.send(result)
    })

    app.delete('/insertItem/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addedToys.deleteOne(query)
      res.send(result)
    })

    app.patch('/insertItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedValues = req.body;
      const update = {
        $set: {
          price: updatedValues.price,
          qty: updatedValues.qty,
          details: updatedValues.details
        }
      };

      try {
        const result = await addedToys.updateOne(query, update);

        res.send(result);
      } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).send("Error updating item");
      }
    });


    app.get('/myToys', async (req, res) => {
      const filter = req.query.email;
      const sort = req.query.sort; // The sort parameter from the request query
    
      try {
        const toysCollection = DB.collection("addedToys");
        let result;
    
        if (sort === "asc") {
          result = await toysCollection.find({ sellarEmail: filter }).sort({ name: 1 }).toArray();
        } else if (sort === "desc") {
          result = await toysCollection.find({ sellarEmail: filter }).sort({ name: -1 }).toArray();
        } else {
          // If no sorting specified, fetch toys without sorting
          result = await toysCollection.find({ sellarEmail: filter }).toArray();
        }
    
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
    




    app.get('/allToys', async (req, res) => {
      const result = await allToys.find().toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send("welcome to Our Toy Shop")
})

app.listen(port, () => {
  console.log(`toy server is running on: ${port}`)
});

module.exports = app;