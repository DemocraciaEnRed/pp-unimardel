const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar etiquetas '
const Tag = models.Tag

const etiquetas = [
  { nombre: 'Equidad de Género', color: '#9747FF', image: 'transgender-alt' },
  { nombre: 'Diversidad', color: '#F9B678', image: 'users' },
  { nombre: 'Accesibilidad', color: '#FF5353', image: 'wheelchair-alt' },
  { nombre: 'Sostenibilidad', color: '#33CC99', image: 'tree' },
  { nombre: 'Innovación', color: '#9E9CFB', image: 'lightbulb-o' },
]



const tags = etiquetas.map(etiqueta => {
  return {
    name: etiqueta.nombre,
    hash: etiqueta.nombre.toLowerCase().replace(/ /g, '-'),
    image: etiqueta.image,
    color: etiqueta.color,
    visible: true
  }
})

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()


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
