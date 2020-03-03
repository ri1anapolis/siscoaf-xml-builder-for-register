const express = require('express')
const bodyParser = require('body-parser')
const getProtocolData = require('./utils/get_protocol_data')

const app = express()
const port = process.env.port || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }))

app.listen(port, () => console.log(`Node started and listening on port ${port}`))

app.get('/api', (req, res) => {
    res.send({})
})

app.get('/api/:originEventNumber', async (req, res) => {
    res.send( await getProtocolData(req.params.originEventNumber) )
    console.log(`Searched for  ${req.params.originEventNumber}`)
})