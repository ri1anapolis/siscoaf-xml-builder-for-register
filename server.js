require('dotenv').config()
const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const getProtocolData = require('./utils/get_protocol_data')
const attributeMapping = require('./utils/attributeMapping')
const transformObject = require('./utils/transform_object')
const createXML = require('./utils/create_xml')
const saveFile = require('./utils/save_file')

const environmentEnv = process.env.NODE_ENV || 'development'
const httpPort = process.env.HTTP_PORT || 8099
const httpsPort = process.env.HTTPS_PORT || 8499
const staticFilesAddress = '/static'
const clientFiles = path.join(__dirname, '/client/build')
const serverSideFiles = path.join(__dirname, '/assets')
const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
}

const app = express()

app.all('*', (req, res, next) => {
  if (!req.secure && environmentEnv === 'production') {
    const secureUrl = `https://${req.hostname}:${httpsPort}${req.path}`
    res.redirect(secureUrl)
    console.log(`Requisition redirected to the secure server: ${secureUrl}`)
  } else {
    next()
  }
})

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", 'https:', "'unsafe-eval'", "'unsafe-inline'"],
    },
  })
)
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(staticFilesAddress, express.static(serverSideFiles))
app.use('/', express.static(clientFiles))

app.get('/api/:originEventNumber', async (req, res) => {
  res.send(await getProtocolData(req.params.originEventNumber))
})

app.post('/api/getXML', (req, res) => {
  const fileName = `${req.body.data.originEventNumber}.xml`
  const transformedObject = transformObject(req.body.data, attributeMapping)
  const xmlData = createXML(transformedObject)
  const status = saveFile(serverSideFiles, fileName, xmlData)
  const fileInfo = {
    status,
    fileName,
    url: `${staticFilesAddress}/${fileName}`,
  }
  res.send(fileInfo)
})

http.createServer(app).listen(httpPort, () => {
  console.log(`Server listening on port ${httpPort}`)
})

https.createServer(sslOptions, app).listen(httpsPort, () => {
  console.log(`Secure server listening on port ${httpsPort}`)
})
