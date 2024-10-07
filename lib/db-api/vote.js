const debug = require('debug')
const log = debug('democracyos:db-api:vote')

const utils = require('lib/utils')
const pluck = utils.pluck

const Vote = require('lib/models').Vote

exports.all = function all (fn) {
  log('Looking for all votes.')

  Vote
    .find()
    .sort('-createdAt')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all votes')
      fn(null, objs)
    })
  return this
}

exports.get = function get (id) {
  log('Looking for Vote with id %s', id)

  return Vote
    .findById(id)
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering Vote %j', obj)
      return obj
    })
}

exports.getVotesByTopic = function get (topicId) {
  log('Looking for Vote by topic id %s', topicId)

  return Vote
    .find({$or:[{voto1: topicId},{voto2:topicId}]})
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering Votes of topic id %s', topicId)
      return obj
    })
}

exports.getVotesVotacion = function () {
  log('Looking for Vote of votación')
  // this does not work, the voting schema does not have a value field
  return Vote
    .find({value: 'voto'})
    .populate('topic author')
    // primeros creados primero
    .sort('createdAt')
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering %s Votes of votación', obj && obj.length)
      return obj
    })
}

exports.getAllwithUser = () => {
  return Vote.find({}).populate('user')
}
exports.getAll = () => {
  return Vote.find({})
}


exports.getCountVotes = function getCountVotes() {
  log('Getting total of votes in votes')

  return Vote
    .count()
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering %s Votes of votación', obj && obj.length)
      return obj
    })
}

exports.getDistinctDNI = function getDistinctDNI() {
  log('Looking for distinct DNI')

  return Vote
    .distinct('dni')
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering %s distinct DNI', obj && obj.length)
      return obj
    })
}

exports.getVotesVotacionWithEverything = async function () {
  log('Looking for Vote of votación')

  return Vote
    .find()
    .populate({
      path: 'voto1',
      populate: {
        path: 'owner'
      }
    })
    .populate({
      path: 'voto2',
      populate: {
        path: 'owner'
      }
    })
    .populate('user claustro facultad')
    // primeros creados primero
    .sort('createdAt')
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering %s Votes of votación', obj && obj.length)
      return obj
    })
}