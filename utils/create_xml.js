const { create } = require('xmlbuilder2')
const dateFormatter = require('./date_formatter')

const ocorrenciasId = `SISCOAF${dateFormatter( Date.now() )}`

function createXML(jsonData) {
    const fullJsonObject = {
        LOTE: {
            OCORRENCIAS :{
                '@ID': ocorrenciasId,
                OCORRENCIA: jsonData,
            }
        }
    }
    const xmlData = create(fullJsonObject)
    const finishedXmlData = xmlData.end({ prettyPrint: true })
    console.log(finishedXmlData)
    return finishedXmlData
}

module.exports = createXML