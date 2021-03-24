require('dotenv').config()
const mysql = require('mysql2/promise')
const getOnlyDigits = require('./get_only_digits')

async function getProtocolData(originEventNumber) {
  try {
    if (originEventNumber.match(/\D/g))
      throw Error('O número informado contém caracteres não válidos!')

    const connectionConfig = {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
    }

    const connection = await mysql.createConnection(connectionConfig)
    const [peopleRows] = await connection.execute(
      `SELECT
          sl5.L5_Nome AS 'personName'
          , IF(sl5.L5_Cpf IS NOT NULL AND sl5.L5_Cpf != '' AND sl5.L5_Cpf != '   .   .   -  '
              , sl5.L5_Cpf
              , IF (sl5.L5_Classificacao = 'Jurídica'
                  , 'PJ'
                  , 'PF'
              )
          ) AS 'personId'
          , CAST(FALSE AS JSON) AS 'personIsPoliticallyExposed'
          , CAST(FALSE AS JSON) AS 'personIsObliged'
          , "0" AS 'personIsGovernmentEmployee'
      FROM sqlreg3.l1parte slp
      INNER JOIN sqlreg3.l5 sl5 ON (slp.p1_parte = sl5.l5_parte AND slp.p1_seq = sl5.l5_seq)
      WHERE slp.p1_protocolo='${originEventNumber}'`
    )
    const [eventRows] = await connection.execute(
      `SELECT
          srr.rr_valoritbi AS 'eventValue'
          , DATE_FORMAT(srr.Rr_DataEscritura ,'%Y-%m-%d')  AS 'eventDate'
      FROM sqlreg3.l1 sl1
      LEFT JOIN sqlreg3.rr srr ON (sl1.L1_ProtRecep = srr.Rr_Protocolo)
      WHERE sl1.L1_Protocolo='${originEventNumber}'`
    )
    await connection.end()

    const eventValue =
      eventRows[0] && +parseFloat(eventRows[0].eventValue || 0).toFixed(2)
    const eventDate = eventRows[0] ? eventRows[0].eventDate : null

    const people = peopleRows.map((person) => {
      const newPerson = { ...person }
      newPerson.personId = getOnlyDigits(person.personId)
      newPerson.personQualification = '1'
      return newPerson
    })

    return {
      originEventNumber,
      eventValue,
      eventInitialDate: eventDate,
      eventFinalDate: eventDate,
      eventCity: process.env.APP_DEFAULT_CITY || null,
      eventState: process.env.APP_DEFAULT_STATE || null,
      notifierId: getOnlyDigits(process.env.APP_DEFAULT_NOTIFIERID),
      eventAssociatedPeopleContainer: {
        eventAssociatedPeople: people,
      },
    }
  } catch (error) {
    console.error(`Erro: ${error.message}`)
    return { message: error.message }
  }
}

module.exports = getProtocolData
