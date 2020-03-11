require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')

const getProtocolData = require('./utils/get_protocol_data')
const attributeMapping = require('./utils/attributeMapping')
const transformObject = require('./utils/transform_object')
const createXML = require('./utils/create_xml')

const app = express()
const port = process.env.BACKEND_PORT || 5000

app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }))

app.listen(port, () => console.log(`Node started in ${app.get('env')} state and listening on port ${port}`))

if (app.get('env') === 'production') {
    app.use('/', express.static('client/build'))
}

app.get('/api', (req, res) => {
    res.send({})
})

app.get('/api/:originEventNumber', async (req, res) => {
    res.send( await getProtocolData(req.params.originEventNumber) )
})

app.post('/api/getXML', (req, res) => {
    const transformedObject = transformObject(req.body.data, attributeMapping)
    res.send(createXML(transformedObject))
})