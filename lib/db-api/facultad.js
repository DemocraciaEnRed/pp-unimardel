const debug = require('debug')
const log = debug('democracyos:db-api:facultad')

const utils = require('lib/utils')
const pluck = utils.pluck

const Facultad = require('lib/models').Facultad

exports.all = function all (fn) {
  log('Looking for all facultades.')

  Facultad
    .find()
    .sort('nombre')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all facultades %o', pluck(objs, 'nombre'))
      fn(null, objs)
    })
  return this
}

exports.get = function get (id, opts) {
  opts = opts || {}
  const {noLog} = opts
  if (!noLog)
    log('Looking for Facultad with id %s', id)

  return Facultad
    .findById(id)
    .catch(err => log('Found error %j', err))
    .then(obj => {
      if (!noLog)
        log('Delivering Facultad %j', obj)
      return obj
    })
}


exports.expose = {}

/**
 * Expose facultad attributes to be used on a private manner.
 *
 * @param {Facultad} facultad.
 * @return {Hash} facultad attributes
 * @api public
 */

exports.expose.confidential = function exposeConfidential (facultad) {
  return expose(exports.expose.confidential.keys)(facultad)
}

exports.expose.confidential.keys = [
  'id',
  'nombre',
]

/**
 * Expose facultad attributes to be used publicly.
 * e.g.: Search calls, facultades listings.
 *
 * @param {Facultad} facultad.
 * @return {Hash} facultad attributes
 * @api public
 */

exports.expose.ordinary = function exposeOrdinary (facultad) {
  return expose(exports.expose.ordinary.keys)(facultad)
}

exports.expose.confidential.keys = [
  'id',
  'nombre',
]

exports.getAll = () => {
  log('Getting claustros')
  return Facultad.find({})
}
