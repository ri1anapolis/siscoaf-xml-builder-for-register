const { create } = require('xmlbuilder2')

function createXML(jsonData) {
    console.log(`xxxxxxxx: ${JSON.stringify(jsonData)}`)
    const data = create({
        root: {
            '@att': 'val',
            data: jsonData.data,
            teste: {}
        }
    })

    return data.end({ prettyPrint: true })
}

module.exports = createXML