require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 7000

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('connected at backend')
})
app.listen(port, () => console.log('connected'))
