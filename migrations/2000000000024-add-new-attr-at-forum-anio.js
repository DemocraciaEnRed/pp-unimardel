const dbReady = require('lib/models').ready

const models = require('lib/models')
const Forum = models.Forum

const nombreMigrationParaLog = 'Se agrega campo: anio al forum para expandir las nuevas ideas'


const newFields = [

  {
    "name": "anio",
    "title": "Año",
    "mandatory": false,
    "kind": "String",
    "icon": "",
    "width": 6,
    "groupOrder": 0,
    "group": "",
    "order": 1,
    "max": 128,
    "min": 0
  },

]

const deepCopy = obj => {
  return JSON.parse(JSON.stringify(obj))
}
/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up(done) {
  dbReady()
    // updatear
    .then(() => {
      return new Promise((resolve, reject) => {
        Forum.findOne({ name: 'proyectos' }, (err, forumProyecto) => {
          if (err)
            reject(new Error(err))
          if (!forumProyecto || !forumProyecto.topicsAttrs)
            reject(new Error('No forum proyectos or no topicAttrs in it found'))

          let copyAttrs = deepCopy(forumProyecto.topicsAttrs)



          // insertamos nuevos campos
          copyAttrs.push(...newFields)


          // borramos todo y volvemos a generar
          forumProyecto.topicsAttrs.splice(0)
          forumProyecto.topicsAttrs.push(...copyAttrs)

          forumProyecto.markModified('topicsAttrs')

          Forum.collection.save(forumProyecto, (err) => {
            if (err) reject(new Error(err))
            resolve()
          })
        })
      })
    })

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
