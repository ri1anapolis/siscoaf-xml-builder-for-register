require('dotenv').config

async function getProtocolData (protocolID) {
    const mysql = require('mysql2/promise')

    
    const connectionConfig = {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    }
    console.log(connectionConfig)

    
    const connection = await mysql.createConnection( connectionConfig )
    const [peopleRows, peopleFields] = await connection.execute(
        `SELECT sl5.L5_Cpf AS 'cpf', sl5.L5_Nome AS 'name'
        FROM sqlreg3.l1parte slp
        INNER JOIN sqlreg3.l5 sl5 ON (slp.p1_parte = sl5.l5_parte AND slp.p1_seq = sl5.l5_seq)
        WHERE slp.p1_protocolo='${protocolID}'`
    )
    const [documentRows, documentFields] = await connection.execute(
        `SELECT srr.rr_valoritbi AS 'documentValue', DATE_FORMAT(srr.Rr_DataEscritura ,'%Y-%m-%d')  AS 'documentDate'
        FROM sqlreg3.l1 sl1
        LEFT JOIN sqlreg3.rr srr ON (sl1.L1_ProtRecep = srr.Rr_Protocolo)
        WHERE sl1.L1_Protocolo='${protocolID}'`
    )
    await connection.end()

    return {
        protocolID,
        documentValue: documentRows[0].documentValue,
        documentDate: documentRows[0].documentDate,
        people: peopleRows
    }
}

module.exports = getProtocolData