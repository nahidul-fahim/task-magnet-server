const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin: ["http://localhost:5173"]
}));
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
        const allTaskCollection = client.db("taskMagnetDB").collection("allTasks")


        //post the new user data to database
        app.post("/newuser", async (req, res) => {
            const newUserInfo = req.body;
            // checking if the user already exists in the database
            const query = { email: newUserInfo.email }
            const userExists = await userCollection.findOne(query)
            if (userExists) {
                return res.send({ message: "User already exists", insertedId: null });
            }
            else {
                const result = await userCollection.insertOne(newUserInfo);
                res.send(result);
            }
        })



        // post new task to the database
        app.post("/newtask", async (req, res) => {
            const newTaskInfo = req.body;
            const result = await allTaskCollection.insertOne(newTaskInfo);
            res.send(result);
        })



        // get the current user
        app.get("/currentuser", async (req, res) => {
            const email = req.query;
            const query = { email: email.email };
            const result = await userCollection.findOne(query);
            res.send(result);
        })


        // get all the tasks for signed in user
        app.get("/alltasks/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email.email };
            const result = await allTaskCollection.find(query).toArray();
            res.send(result);
        })



        // get a single task
        app.get("/singletask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allTaskCollection.findOne(query);
            res.send(result);
        })



        // delete a task
        app.delete("/deletetask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allTaskCollection.deleteOne(query);
            res.send(result);
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




// checking if server is running
app.get("/", (req, res) => {
    res.send("Task Magnet Server is ready to serve")
})

// checking the server running port
app.listen(port, () => {
    console.log("Task Magnet server is running on port:", port)
})