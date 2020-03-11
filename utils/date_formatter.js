function dateFormatter(date, literal) {
    const formatter = new Intl.DateTimeFormat(
        'pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }
    )
    return formatter.format( date ).replace(/\//g, literal || "")
}

module.exports = dateFormatter