function getOnlyDigits(string) {
    return  string.match(/\d+/g).join('')
}

module.exports = getOnlyDigits