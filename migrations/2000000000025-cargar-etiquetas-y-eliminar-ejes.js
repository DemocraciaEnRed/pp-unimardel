const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar etiquetas y eliminar ejes por ser innecesarios en este pp'
const Tag = models.Tag
const Eje = models.Eje

const etiquetas = [
  { nombre: 'Equidad de Género' },
  { nombre: 'Diversidad' },
  { nombre: 'Accesibilidad' },
  { nombre: 'Sostenibilidad' },
  { nombre: 'Innovación' },
]



const tags = etiquetas.map(etiqueta => {
  return {
    name: etiqueta.nombre,
    hash: etiqueta.nombre.toLowerCase().replace(/ /g, '-'),
    image: 'people',
    color: '#091A33',
    visible: true
  }
})

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // borramos data en eje al ser innecesaria para el funcionamiento del sistema y esto confunde con Tags
    .then(() => Eje.collection.deleteMany({}))

    // quitamos la visibilidad a las tags viejas
    .then(() => Tag.collection.updateMany({}, {$set: {visible: false}}))

    // Agregamos las nuevas tags
    .then(() => Tag.insertMany(tags) )

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
