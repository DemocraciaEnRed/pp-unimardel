const debug = require('debug')
const log = debug('democracyos:db-api:zona')

const utils = require('lib/utils')
const pluck = utils.pluck

const Zona = require('lib/models').Zona

exports.all = function all (fn) {
  log('Looking for all zonas.')

  Zona
    .find()
    .sort('nombre')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all zonas %o', pluck(objs, 'nombre'))
      fn(null, objs)
    })
  return this
}

exports.get = function get (id, opts) {
  opts = opts || {}
  const {noLog} = opts
  if (!noLog)
    log('Looking for Zona with id %s', id)

  return Zona
    .findById(id)
    .catch(err => log('Found error %j', err))
    .then(obj => {
      if (!noLog)
        log('Delivering Zona %j', obj)
      return obj
    })
}
