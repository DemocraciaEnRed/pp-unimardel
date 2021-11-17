const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ZonaSchema = new Schema({
  nombre: { type: String, required: true, minlength: 1, maxlength: 200 },
}, { id: false })
// esto último hace que no esté el campo _id e id duplicado

ZonaSchema.statics.findByName = function (name, cb) {
  return this.findOne({ name: name }).exec(cb)
}

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

ZonaSchema.set('toObject', { getters: true })
ZonaSchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  // agregamos el tecer argumento sino crea la tabla "zonas" (o sea, con mala terminación)
  return conn.model('Zona', ZonaSchema, 'zonas')
}
