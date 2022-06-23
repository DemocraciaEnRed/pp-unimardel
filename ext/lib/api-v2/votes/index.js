const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const votesMiddlewares = require('./middlewares')
const apiV2 = require('lib/api-v2/db-api')

const app = module.exports = express.Router()

app.get('/votes/hasVoted/:dni',
  middlewares.users.restrict, // restringe
  function hasVoted (req, res, next) {
    apiV2.votes.hasVoted({
      dni: req.params.dni
    }).then((hasVoted) => {
      res.status(200).json({
        hasVoted
      })
    })
  })



app.post('/votes/create',
  middlewares.users.restrict, // restringe
  middlewares.forums.findFromBody,
  middlewares.zonas.findFromBody,
  votesMiddlewares.findVoto1FromBody, // Agrega el voto1 al req
  middlewares.topics.privileges.canVote,
  votesMiddlewares.findVoto2FromBody,// Agrega el voto2 al req
  middlewares.topics.privileges.canVote,
  function postVote (req, res, next) {
    apiV2.votes.create({
      user: req.user,
      userPrivileges: req.body.userPrivileges,
      dni: req.body.dni,
      zona: req.zona,
      voto1: req.voto1,
      voto2: req.voto2
    }).then((vote) => {
      res.status(200).json({
        status: 200,
        results: {
          vote: 'fulfilled'
        }
      })
    }).catch((err) => {
      console.log(err)
      // reglas para que devolver errores propios, por ejemplo NOT_VOTED o ALREADY_VOTED
      if (err.code) {
        return next({ status: 400, code: err.code })
      }
      next(err)
    })
  })