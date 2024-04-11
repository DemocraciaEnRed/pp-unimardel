const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar facultades'
const Facultad = models.Facultad

const facultades = [

  { nombre: 'CNAI'},
  { nombre: 'ESM'},
  { nombre: 'F.PSICO'},
  { nombre: 'FAUD'},
  { nombre: 'FCA'},
  { nombre: 'FCEyN'},
  { nombre: 'FCEyS'},
  { nombre: 'FCSYTS'},
  { nombre: 'FD'},
  { nombre: 'FH'},
  { nombre: 'FI'},
  { nombre: 'Rec'},
]

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        Facultad.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay facultades cargadas (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })

    // Agregamos data
    .then(() => Facultad.collection.insertMany(facultades))

    // Todo OK
    .then(() => {
      console.log(`-- Migración ${nombreMigrationParaLog} exitosa`)
      done()
    })
    // Error
    .catch((err) => {
      console.log(`-- Migración ${nombreMigrationParaLog} no funcionó! Error: ${err}`)
      done(err)
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
