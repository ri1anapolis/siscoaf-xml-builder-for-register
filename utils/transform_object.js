function transformObject( object, attributesMap, excludeNonMappedAttributes = true ) {
    
    if (typeof object !== "object" ) {
        return object
    }
    
    const newObject = {}
    
    Object.keys(object).forEach((attribute) => {
        let attributeValue = object[attribute]

        if (Array.isArray( object[attribute] )) {
            attributeValue = object[attribute].map( (arrayItem) => {
                return transformObject (arrayItem, attributesMap, excludeNonMappedAttributes)
            })
        } else if ( object[attribute] instanceof Object ) {
            attributeValue = transformObject( object[attribute], attributesMap, excludeNonMappedAttributes )
        }

        if ( "boolean" === typeof attributeValue ) {
            attributeValue = `${attributeValue | 0}`
        }

        if ( attributesMap.hasOwnProperty(attribute) ) {
            newObject[attributesMap[attribute]] = attributeValue
        } else if ( !excludeNonMappedAttributes ){
            newObject[attribute] = attributeValue
        }

        console.log(`${JSON.stringify([attribute])}: ${attributeValue}`)
    })


    return newObject
}

module.exports = transformObject
