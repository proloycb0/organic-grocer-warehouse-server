const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6cg8le.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const inventoriesCollection = client.db('organicGrocer').collection('inventory');
        const blogsCollection = client.db('organicGrocer').collection('blogs');

        // inventories api
        app.get('/inventory', async (req, res) => {
            const result = await inventoriesCollection.find().toArray();
            res.send(result);
        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoriesCollection.findOne(query);
            res.send(inventory);
        });

        // use put update quantity
        app.put('/updateQuantity/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = {_id: ObjectId(id) }
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    quantity: data.updateQuantity,
                }
            }
            const result = await inventoriesCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        })

        // blogs api
        app.get('/blogs', async (req, res) => {
            const result = await blogsCollection.find().toArray();
            res.send(result);
        });

    }
    finally { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Organic Grocer website')
})

app.listen(port, () => {
    console.log(`Organic Grocer app listening on port ${port}`)
})
