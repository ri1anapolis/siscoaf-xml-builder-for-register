require('dotenv').config()
const mysql = require('mysql2/promise')

async function getProtocolData (originEventNumber) {
    const connectionConfig = {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    }
    
    const connection = await mysql.createConnection( connectionConfig )
    const [peopleRows, peopleFields] = await connection.execute(
        `SELECT sl5.L5_Cpf AS 'personId', sl5.L5_Nome AS 'personName'
        FROM sqlreg3.l1parte slp
        INNER JOIN sqlreg3.l5 sl5 ON (slp.p1_parte = sl5.l5_parte AND slp.p1_seq = sl5.l5_seq)
        WHERE slp.p1_protocolo='${originEventNumber}'`
    )
    const [eventRows, eventFields] = await connection.execute(
        `SELECT srr.rr_valoritbi AS 'eventValue', DATE_FORMAT(srr.Rr_DataEscritura ,'%Y-%m-%d')  AS 'eventDate'
        FROM sqlreg3.l1 sl1
        LEFT JOIN sqlreg3.rr srr ON (sl1.L1_ProtRecep = srr.Rr_Protocolo)
        WHERE sl1.L1_Protocolo='${originEventNumber}'`
    )
    await connection.end()

    const eventValue = eventRows[0] && +(parseFloat(eventRows[0].eventValue || 0).toFixed(2))
    const eventDate = eventRows[0]? eventRows[0].eventDate : null

    return {
        originEventNumber,
        eventValue,
        eventInitialDate: eventDate,
        eventFinalDate: eventDate,
        eventAssociatedPeople: peopleRows
    }
}

module.exports = getProtocolData