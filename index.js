require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');

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
        // get review  data
        app.get('/reviews', async (req, res) => {
            const cursor = await reviewCollection.find({})
            const reviews = await cursor.toArray();
            res.json(reviews)
        })
    } finally {

    }
}

run().catch(console.error)

app.get('/', (req, res) => {
    res.send('connected at backend')
})
app.listen(port, () => console.log('connected'))
