
const debug = require('debug')
const log = debug('democracyos:api:proyectistas')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
//var maintenance = utils.maintenance
const json2csv = require('json-2-csv').json2csv
const moment = require('moment')


const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

function escapeTxt(text) {
    if (!text) return ''
    text += ''
    return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.get('/stats/registrosNoValidos/csv',
    restrict,
    staff,
    function getProyectistas(req, res, next) {
        log('Getting proyectistas')

        dbApi.user.getUsersNotEmailValidated().then((proyectistas) => {
            if (proyectistas) {
                log('Serving padron')
                req.proyectistas = proyectistas
                next()
            } else {
                req.proyectistas = []
                return []
            }
        })
    },
    function sendCsv(req, res, next) {
        var infoProyectistas = req.proyectistas.map((u) => {
            return [
                u.firstName,
                u.lastName,
                u.dni,
                u.email,
                u.claustro && u.claustro.nombre ? escapeTxt(u.claustro.nombre) : '??',
                u.facultad && u.facultad.nombre ? escapeTxt(u.facultad.nombre) : '??',
                moment(u.createdAt).format('YYYY-MM-DD HH:mm:ss')
            ]
        })
        var data = [['Nombre', 'Apellido', 'DNI', 'Email', 'Claustro', 'Facultad', 'Fecha de registro']]
        data = data.concat(infoProyectistas)
        json2csv(data, function (err, csv) {
            if (err) {
                log('get csv: array to csv error', err)
                return res.status(500).end()
            }
            res.status(200)
            res.set({
                'Content-Encoding': 'UTF-8',
                'Content-Type': 'text/csv; charset=UTF-8',
                'Content-Disposition': `attachment; filename=registrosNoValidados-${Math.floor((new Date()) / 1000)}.csv`
            })
            res.write(csv)
            res.end()
        }, { prependHeader: false, excelBOM: true })
    }
)

app.get('/stats/usuariosQueNoVotaron/csv',
    restrict,
    staff,
    function getDNIsWhoVoted(req, res, next) {
        log('Getting DNIs who voted')
        dbApi.vote.getDistinctDNI().then((dniList) => {
            if (dniList) {
                log('Serving padron')
                req.dniList = dniList
                next()
            } else {
                req.dniList = []
                return []
            }
        })
    },
    function getUsersWhoDidntVoted(req, res, next) {
        log('Getting users who didnt voted')
        dbApi.user.getUsersWhoDidntVotedWithClaustroAndFacultad(req.dniList).then((users) => {
            if (users) {
                log('Serving users')
                req.usersNotVoted = users
                next()
            } else {
                req.usersNotVoted = []
                return []
            }
        })
    },
    function sendCsv(req, res, next) {
        var infoUsers = req.usersNotVoted.map((u) => {
            return [
                u.firstName,
                u.lastName,
                u.dni,
                u.email,
                u.emailValidated,
                u.claustro && u.claustro.nombre ? escapeTxt(u.claustro.nombre) : '??',
                u.facultad && u.facultad.nombre ? escapeTxt(u.facultad.nombre) : '??'
            ]
        })
        var data = [['Nombre', 'Apellido', 'DNI', 'Email', 'Valido email?', 'Claustro', 'Facultad']]
        data = data.concat(infoUsers)
        json2csv(data, function (err, csv) {
            if (err) {
                log('get csv: array to csv error', err)
                return res.status(500).end()
            }
            res.status(200)
            res.set({
                'Content-Encoding': 'UTF-8',
                'Content-Type': 'text/csv; charset=UTF-8',
                'Content-Disposition': `attachment; filename=ppunmdp-facultades-usuarios-que-no-votaron-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`
            })
            res.write(csv)
            res.end()
        }, {
            prependHeader: false, excelBOM: true, delimiter: {
                wrap: '"', // Double Quote (") character
                field: ',', // Comma field delimiter
                array: ';', // Semicolon array value delimiter
                eol: '\n' // Newline delimiter
            }
        })
    }
)

app.get('/stats/listadoDeVotosPorVotante/csv',
    restrict,
    staff,
    async function getAllVotes(req, res, next) {
        let votesArray = await dbApi.vote.getVotesVotacionWithEverything()
        req.votesArray = votesArray
        next()
    },
    async function getAllUsersFromVotes(req, res, next) {
        // for every vote.dni get its user
        let dniList = await dbApi.vote.getDistinctDNI()
        let usersArray = await dbApi.user.getAllUsersInDNIArray(dniList)
        // make a map of dni -> user
        let dniUserMap = {}
        usersArray.forEach((user) => {
            if (user.dni) dniUserMap[user.dni] = user
        })
        req.dniUserMap = dniUserMap

        // group votes by dni
        let votesByDNI = {}
        req.votesArray.forEach(vote => {
            votesByDNI[vote.dni] = vote
        })
        req.votesByDNI = votesByDNI
        next()
    },
    function sendCsv(req, res, next) {
        let DNIsArray = Object.keys(req.votesByDNI)
        var infoVotes = DNIsArray.map((dni) => {
            let votes = req.votesByDNI[dni]
            let userVote = req.dniUserMap[dni]
            let facultad = null

            if (userVote && userVote.facultad) {
                facultad = userVote.facultad.nombre
            } else if (votes.facultad) {
                facultad = votes.facultad.nombre
            }
            else {
                facultad = '-Sin dato-'
            }
            let claustro = null
            if (userVote && userVote.claustro) {
                claustro = userVote.claustro.nombre
            } else {
                claustro = '-Sin dato-'
            }

            return [
                escapeTxt(votes.dni),
                escapeTxt(userVote ? userVote.firstName : '- No Registrado -'),
                escapeTxt(userVote ? userVote.lastName : '- No Registrado -'),
                userVote ? 'Si' : 'No',
                escapeTxt(facultad),
                votes.user.dni !== votes.dni ? 'Presencial' : 'Online',
                votes.length,
                votes.voto1 ? escapeTxt(votes.voto1.mediaTitle) : '-',
                votes.voto2 ? escapeTxt(votes.voto2.mediaTitle) : '-',
            ]
        })

        var data = [['DNI', 'Nombre', 'Apellido', 'Registrado?', 'Facultad', 'Formato', 'Cantidad Votos', 'Voto 1', 'Voto 2']]
        data = data.concat(infoVotes)
        json2csv(data, function (err, csv) {
            if (err) {
                log('get csv: array to csv error', err)
                return res.status(500).end()
            }
            res.status(200)
            res.set({
                'Content-Encoding': 'UTF-8',
                'Content-Type': 'text/csv; charset=UTF-8',
                'Content-Disposition': `attachment; filename=ppunmdp-facultades-listado-votos-por-votantes-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`
            })
            res.write(csv)
            res.end()
        }, {
            prependHeader: false, excelBOM: true, delimiter: {
                wrap: '"', // Double Quote (") character
                field: ',', // Comma field delimiter
                array: ';', // Semicolon array value delimiter
                eol: '\n' // Newline delimiter
            }
        })
    }
)

app.get('/stats/listadoDeVotos/csv',
    restrict,
    staff,
    async function getAllVotes(req, res, next) {
        let votesArray = await dbApi.vote.getVotesVotacionWithEverything()
        req.votesArray = votesArray
        next()
    },
    async function getAllUsersFromVotes(req, res, next) {
        // for every vote.dni get its user
        let dniList = await dbApi.vote.getDistinctDNI()
        let usersArray = await dbApi.user.getAllUsersInDNIArray(dniList)
        // make a map of dni -> user
        let dniUserMap = {}
        usersArray.forEach((user) => {
            if (user.dni) dniUserMap[user.dni] = user
        })
        req.dniList = dniList
        req.dniUserMap = dniUserMap
        // add user to vote
        const votes = []
        req.votesArray.forEach((vote) => {
            if (vote.voto1) votes.push({
                ...vote.voto1._doc,
                author: vote.user,
                dni: vote.dni,
                user: dniUserMap[vote.dni]
            })
            if (vote.voto2) votes.push({
                ...vote.voto2._doc,
                author: vote.user,
                dni: vote.dni,
                user: dniUserMap[vote.dni]
            })
        })
        req.votesArray = votes
        next()
    },
    function sendCsv(req, res, next) {
        var infoVotos = req.votesArray.map((vote) => {
            let facultad = null
            if (vote.user && vote.user.facultad) {
                facultad = vote.user.facultad.nombre
            } else if (vote.facultad) {
                facultad = vote.facultad.nombre
            } else {
                facultad = '-Sin dato-'
            }
            let claustro = null
            if (vote.user && vote.user.claustro) {
                claustro = vote.user.claustro.nombre
            } else if (vote.claustro) {
                claustro = vote.claustro.nombre
            } else {
                claustro = '-Sin dato-'
            }
            return [
                escapeTxt(moment(vote.createdAt).format('YYYY-MM-DD HH:mm:ss')),
                escapeTxt(vote.author.dni),
                escapeTxt(vote.author.firstName),
                escapeTxt(vote.author.lastName),
                vote.author.dni !== vote.dni ? 'Presencial' : 'Online',
                escapeTxt(vote.dni),
                escapeTxt(vote.user ? 'Si' : 'No'),
                escapeTxt(vote.user ? vote.user.firstName : '- No Registrado -'),
                escapeTxt(vote.user ? vote.user.lastName : '- No Registrado -'),
                escapeTxt(facultad),
                escapeTxt(vote.mediaTitle)
            ]
        })
        var data = [['Fecha Votacion', 'Autor DNI', 'Autor Nombre', 'Autor Apellido', 'Formato', 'DNI Votante', 'Registrado?', 'Nombre Votante', 'Apellido Votante', 'Facultad Votante', 'Proyecto']]

        data = data.concat(infoVotos)
        json2csv(data, function (err, csv) {
            if (err) {
                log('get csv: array to csv error', err)
                return res.status(500).end()
            }
            res.status(200)
            res.set({
                'Content-Encoding': 'UTF-8',
                'Content-Type': 'text/csv; charset=UTF-8',
                'Content-Disposition': `attachment; filename=ppunmdp-facultades-listado-votos-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`
            })
            res.write(csv)
            res.end()
        }, {
            prependHeader: false, excelBOM: true, delimiter: {
                wrap: '"', // Double Quote (") character
                field: ',', // Comma field delimiter
                array: ';', // Semicolon array value delimiter
                eol: '\n' // Newline delimiter
            }
        })
    }
)

app.get('/stats/votosPorProyectos/csv',
    restrict,
    staff,
    async function getAllVotes(req, res, next) {
        let votesArray = await dbApi.vote.getVotesVotacionWithEverything()
        req.votesArray = votesArray
        // group by topic
        let votesByTopic = {}
        votesArray.forEach((vote) => {
            if (vote.voto1) {
                if (!votesByTopic[vote.voto1.id]) votesByTopic[vote.voto1.id] = []
                votesByTopic[vote.voto1.id].push(vote.voto1)
            }
            if (vote.voto2) {
                if (!votesByTopic[vote.voto2.id]) votesByTopic[vote.voto2.id] = []
                votesByTopic[vote.voto2.id].push(vote.voto2)
            }
        })
        req.votesByTopic = votesByTopic
        next()
    },
    function sendCsv(req, res, next) {
        var infoVotos = Object.keys(req.votesByTopic)
        let votesCount = 0
        var infoProyectos = infoVotos.map((topicId) => {
            let votes = req.votesByTopic[topicId]
            let topic = votes[0]
            votesCount += votes.length
            return [
                escapeTxt(topic.mediaTitle),
                escapeTxt(votes.length)
            ]
        })
        infoProyectos.push(['Total', votesCount])
        var data = [['Proyecto', 'Cantidad Votos']]
        data = data.concat(infoProyectos)
        json2csv(data, function (err, csv) {
            if (err) {
                log('get csv: array to csv error', err)
                return res.status(500).end()
            }
            res.status(200)
            res.set({
                'Content-Encoding': 'UTF-8',
                'Content-Type': 'text/csv; charset=UTF-8',
                'Content-Disposition': `attachment; filename=ppunmdp-facultades-cantidad-votos-por-proyecto-${Math.floor((new Date()) / 1000)}.csv`
            })
            res.write(csv)
            res.end()
        }, {
            prependHeader: false, excelBOM: true, delimiter: {
                wrap: '"', // Double Quote (") character
                field: ',', // Comma field delimiter
                array: ';', // Semicolon array value delimiter
                eol: '\n' // Newline delimiter
            }
        })
    }
)