require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const getProtocolData = require('./utils/get_protocol_data')
const createXML = require('./utils/create_xml')

const app = express()
const port = process.env.BACKEND_PORT || 5000

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

app.post('/api/getXML', (req, res) => {
    res.send(createXML(req.body))
    console.log(createXML(req.body))
})