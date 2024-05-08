const api = require('../db-api')

function findWithId(id, req, res, next) {
    api.claustros.find({ _id: id })
        .findOne()
        .exec()
        .then((claustro) => {
            if (!claustro) return next(new Error404(id))

            req.claustro = claustro

            next()
        })
        .catch(next)
}

exports.findById = function findById(req, res, next) {
    return findWithId(req.params.id, req, res, next)
}

exports.findFromBody = function findFromBody(req, res, next) {
    return findWithId(req.body.claustro, req, res, next)
}

exports.findFromQuery = function findFromBody(req, res, next) {
    return findWithId(req.query.claustro, req, res, next)
}

exports.findFromTopic = function findFromTopic(req, res, next) {
    return findWithId(req.topic.claustro, req, res, next)
}

class Error404 extends Error {
    constructor(id) {
        super(`Claustro ${id} not found.`)

        this.status = 404
        this.code = 'CLAUSTRO_NOT_FOUND'
    }
}
