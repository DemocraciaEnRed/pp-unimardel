const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar facultades y claustros'
const Facultad = models.Facultad
const Claustro = models.Claustro

const facultades = [
  { nombre: 'Arquitectura, Urbanismo y Diseño', abreviacion: 'FAUD' },
  { nombre: 'Facultad de Ciencias Agrarias', abreviacion: 'FCA' },
  { nombre: 'Facultad de Ciencias de la Salud y Trabajo Social', abreviacion: 'FCSYTS' },
  { nombre: 'Facultad de Ciencias Económicas y Sociales', abreviacion: 'FCEyS' },
  { nombre: 'Facultad de Ciencias Exactas y Naturales', abreviacion: 'FCEyN' },
  { nombre: 'Facultad de Derecho', abreviacion: 'FD' },
  { nombre: 'Facultad de Humanidades', abreviacion: 'FH' },
  { nombre: 'Facultad de Ingeniería', abreviacion: 'FI' },
  { nombre: 'Facultad de Psicologia', abreviacion: 'F.PSICO' },
  { nombre: 'Escuela Superior de Medicina', abreviacion: 'ESM' },
  { nombre: 'Colegio Nacional Arturo Illia', abreviacion: 'CNAI' },
  { nombre: 'Rectorado', abreviacion: 'Rec' },
]
const claustros = [
  { nombre: 'Estudiantes' },
  { nombre: 'Docentes' },
  { nombre: 'Nodocentes' },
  { nombre: 'Graduados/as' },
]

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
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
    .then(() => {
      return new Promise((resolve, reject) => {
        Claustro.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay claustros cargados (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })

    // Agregamos data
    .then(() => Facultad.collection.insertMany(facultades))
    .then(() => Claustro.collection.insertMany(claustros))

    // Todo OK
    .then(() => {
      console.log(`-- Migración ${nombreMigrationParaLog} exitosa`)
      done()
    })
    // Error
    .catch((err) => {
      console.log(err);
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
