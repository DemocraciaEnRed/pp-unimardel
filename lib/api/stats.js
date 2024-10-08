const debug = require('debug')
const log = debug('democracyos:api:stats')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/stats',
    restrict,
    staff,
    async function getStats(req, res, next) {
        log('Getting stats')
        // send 200
        let usersNotvalidated = await dbApi.user.getUsersNotEmailValidated()
        let usersNotvalidatedCount = usersNotvalidated.length
        let emailUsersNotValidated = usersNotvalidated.map(user => {
            return {
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                createdAt: user.createdAt,
                claustro: user.claustro ? user.claustro.nombre : '-',
                facultad: user.facultad ? user.facultad.abreviacion : '-'
            }
        })

        res.status(200).json({
            stats: {
                users: await dbApi.user.getUsersCount(),
                userNotEmailValidated: await dbApi.user.getUsersNotEmailValidated().count(),
                topics: await dbApi.topic.getCount(),
                likes: await dbApi.topic.sumProyectistasInTopics(),
                comments: await dbApi.topic.getCommentsCount(),
                replies: usersNotvalidatedCount,
                emailsNotValidated: emailUsersNotValidated
            }
        })
    }
)

app.get('/stats/votacion',
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
        // clone votesArray
        // let votesArray = req.votesArray
        const votes = []
        req.votesArray.forEach((vote) => {
            if (vote.voto1) votes.push({
                ...vote.voto1._doc,
                author: vote.user,
                dni: vote.dni,
                facultad: vote.facultad,
                claustro: vote.claustro,
                user: dniUserMap[vote.dni]
            })
            if (vote.voto2) votes.push({
                ...vote.voto2._doc,
                author: vote.user,
                dni: vote.dni,
                facultad: vote.facultad,
                claustro: vote.claustro,
                user: dniUserMap[vote.dni]
            })
        })
        req.votesArray = votes
        next()
    },
    async function getStats(req, res, next) {
        // console.log(req.votesArray)
        log('Getting stats')
        // send 200
        let votesCount = req.votesArray.length
        let dniList = req.dniList
        let usersWhoDidntVoted = await dbApi.user.getUsersWhoDidntVoted(dniList)
        let usersWhoDidntVotedCount = usersWhoDidntVoted.length
        let facultades = {}
        let claustros = {}
        let votosPresencial = 0 // if vote.author.dni is different to vote.dni
        let votosOnline = 0 // if vote.author.dni is equal to vote.dni

        // group votes by dni
        let votesByDNI = {}

        req.votesArray.forEach(vote => {
            if (votesByDNI[vote.dni]) {
                votesByDNI[vote.dni].push(vote)
            } else {
                votesByDNI[vote.dni] = [vote]
            }
        })

        let votesByDNIKeys = Object.keys(votesByDNI)
        votesByDNIKeys.forEach((dni) => {
            if (votesByDNI[dni][0]) {
                let theVote = votesByDNI[dni][0]
                if (theVote.author.dni !== theVote.dni) {
                    votosPresencial++
                } else {
                    votosOnline++
                }
                if (theVote.facultad) {
                    if (facultades[theVote.facultad.abreviacion]) {
                        facultades[theVote.facultad.abreviacion]++
                    } else {
                        facultades[theVote.facultad.abreviacion] = 1
                    }
                } else if (theVote.user && theVote.user.facultad) {
                    if (facultades[theVote.user.facultad.abreviacion]) {
                        facultades[theVote.user.facultad.abreviacion]++
                    } else {
                        facultades[theVote.user.facultad.abreviacion] = 1
                    }
                }
                if (theVote.claustro) {
                    if (claustros[theVote.claustro.nombre]) {
                        claustros[theVote.claustro.nombre]++
                    } else {
                        claustros[theVote.claustro.nombre] = 1
                    }
                } else if (theVote.user && theVote.user.claustro) {
                    if (claustros[theVote.user.claustro.nombre]) {
                        claustros[theVote.user.claustro.nombre]++
                    } else {
                        claustros[theVote.user.claustro.nombre] = 1
                    }
                }
            }
        })

        // console.dir(facultades)
        // console.dir(claustros)
        // console.log(votosOnline)
        // console.log(votosPresencial)

        res.status(200).json({
            stats: {
                votesCount,
                dniCount: dniList.length,
                // usersWhoDidntVoted,
                usersWhoDidntVotedCount,
                votosPresencial,
                votosOnline,
                facultades,
                claustros
            }
        })
    }
)