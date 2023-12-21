const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// database user and password
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;




const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.xeklkbf.mongodb.net/?retryWrites=true&w=majority`;

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

        // database and collection
        const userCollection = client.db("taskMagnetDB").collection("allUsers")


        //post the new user data to database
        // app.post("/newuser")






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);




// checking if server is running
app.get("/", (req, res) => {
    res.send("Task Magnet Server is ready to serve")
})

// checking the server running port
app.listen(port, () => {
    console.log("Task Magnet server is running on port:", port)
})