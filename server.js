require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')

const getProtocolData = require('./utils/get_protocol_data')
const attributeMapping = require('./utils/attributeMapping')
const transformObject = require('./utils/transform_object')
const createXML = require('./utils/create_xml')
const saveFile = require('./utils/save_file')

const app = express()
const port = process.env.BACKEND_PORT || 8099
const staticFilesAddress = '/static'
const clientFiles = `${__dirname}/client/build`
const seversideFiles = `${__dirname}/assets`

app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }))

app.listen(port, () => console.log(`Node started in ${app.get('env')} state and listening on port ${port}`))

if (app.get('env') === 'production') {
    app.use('/', express.static(clientFiles))
}

app.use(staticFilesAddress, express.static(seversideFiles))

app.get('/api', (req, res) => {
    res.send({})
})

app.get('/api/:originEventNumber', async (req, res) => {
    res.send( await getProtocolData(req.params.originEventNumber) )
})

app.post('/api/getXML', (req, res) => {
    const fileName = `${req.body.data.originEventNumber}.xml`
    const transformedObject = transformObject(req.body.data, attributeMapping)
    const xmlData = createXML(transformedObject)
    const status = saveFile(seversideFiles, fileName, xmlData)
    const fileInfo = {
        status,
        fileName,
        url: `${staticFilesAddress}/${fileName}`
    }
    res.send(fileInfo)
})