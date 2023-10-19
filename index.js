const express = require("express");
const app = express()
const cors = require('cors')
const port = process.env.PORT || 9999
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midleware

app.use(cors());
app.use(express.json())







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
    const cart = DB.collection('cart')
    const review = DB.collection('review')

    


    app.get('/review', async(req, res)=>{
      const result = await review.find().toArray()
      res.send(result)
    })


    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email
      const query = {user : email}
      const result = await cart.find(query).toArray()
      res.send(result)
    })

    app.post('/cart', async (req, res) => {
      const cartItem = req.body;

      // Check if an item with the same _id already exists in the cart
      const existingItem = await cart.findOne({ _id: cartItem._id });

      if (existingItem) {
        // If the item exists, increment its qty by 1
        existingItem.qty += 1;
        // Update the existing item in the cart
        const updateResult = await cart.updateOne({ _id: cartItem._id }, { $set: { qty: existingItem.qty } });
        res.send(updateResult);
      } else {
        // If the item doesn't exist, insert it as a new item
        const result = await cart.insertOne(cartItem);
        res.send(result); 
      }
    });


    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: id}
      const result = await cart.deleteOne(query)
      res.send(result)
    })




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
  res.send(`welcome to Our Toy Shop: Running on Port: ${port}`)
})

app.listen(port, () => {
  console.log(`toy server is running on: ${port}`)
});

module.exports = app; 