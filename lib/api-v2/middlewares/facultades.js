const api = require('../db-api')

function findWithId (id, req, res, next) {
  api.facultades.find({ _id: id })
    .findOne()
    .exec()
    .then((facultad) => {
      if (!facultad) return next(new Error404(id))

      req.facultad = facultad

      next()
    })
    .catch(next)
}

exports.findById = function findById (req, res, next) {
  return findWithId(req.params.id, req, res, next)
}

exports.findFromBody = function findFromBody (req, res, next) {
  return findWithId(req.body.facultad, req, res, next)
}

exports.findFromQuery = function findFromBody (req, res, next) {
  return findWithId(req.query.facultad, req, res, next)
}

exports.findFromTopic = function findFromTopic (req, res, next) {
  return findWithId(req.topic.facultad, req, res, next)
}

class Error404 extends Error {
  constructor (id) {
    super(`Facultad ${id} not found.`)

    this.status = 404
    this.code = 'ZONA_NOT_FOUND'
  }
}
