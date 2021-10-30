require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 7000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n8gcc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('TravelSite')
        const siteCollection = database.collection('sites')
        const bookedCollection = database.collection('book')
        const reviewCollection = database.collection('reviews')

        // get site data
        app.get('/sites', async (req, res) => {
            const cursor = await siteCollection.find({})
            const sites = await cursor.toArray();
            res.json(sites)
        })
        // get order data
        app.get('/orders', async (req, res) => {
            console.log('insdie order')
            const cursor = await bookedCollection.find({})
            const order = await cursor.toArray();
            res.json(order)
        })
        // get review  data
        app.get('/reviews', async (req, res) => {
            const cursor = await reviewCollection.find({})
            const reviews = await cursor.toArray();
            res.json(reviews)
        })
        // get site data by id
        app.get('/site/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) }
            const siteData = await siteCollection.findOne(query);
            res.json(siteData)
        })
        // order post
        app.post('/order', async (req, res) => {
            const query = req.body;
            const result = await bookedCollection.insertOne(query);
            console.log(result)
            res.json(result)
        })

        // get order by emails
        app.get('/order/:mail', async (req, res) => {
            const filter = req.params.mail;
            const query = { email: filter }
            const data = await bookedCollection.find(query).toArray();
            res.send(data)
        })

        // delete order by emails
        app.delete('/order/:id', async (req, res) => {
            console.log('hitting')
            const filter = req.params.id;
            const query = { _id: ObjectID(filter) }
            const data = await bookedCollection.deleteOne(query);
            res.send(data)
        })
        // update by id
        app.put('/orderUpdate/:id', async (req, res) => {
            console.log('hitting put');
            const msg = 'confirmed';
            const filter = req.params.id;
            const query = { _id: ObjectID(filter) }
            const data = await bookedCollection.updateOne(query, {
                $set: {
                    orderStatus: "confirmed",
                }
            });
            console.log(data)
            res.send(data)
        })

    } finally {
        // client.close();
    }
}

run().catch(console.error)

app.get('/', (req, res) => {
    res.send('connected at backend')
})
app.listen(port, () => console.log('connected'))
