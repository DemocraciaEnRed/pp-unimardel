const config = require('lib/config')

const dbReady = require('lib/models').ready

const Text = require('lib/models').Text

const textsData = [
  //home
  { "name": "home-title", "text": "PRESUPUESTO PARTICIPATIVO DE UNIVERSIDAD DE MAR DEL PLATA" },
  { "name": "home-encuentro-title", "text": "NOVEDADES Y PRÓXIMOS ENCUENTROS" },
  { "name": "home-encuentro-subtitle", "text": "Agendate la reunión de tu facultad y presentá tus ideas." },

  //baner 1 
  { "name": "home-banner-image", "text": "/ext/lib/site/banner-invitacion/icon-idea.png" },
  { "name": "home-banner-title", "text": '¡Próximamente abrirá la etapa de subida de ideas' },
  { "name": "home-banner-subtitle", "text": 'Te invitamos a registrarte para notificarte cuando la misma este disponible, que puedas compartir tus ideas con la comunidad. Tambien podes conocer el avance de los proyectos del 2023' },
  { "name": "home-banner-button1-text", "text": 'Registrate' },
  { "name": "home-banner-button1-link", "text": "/signup" },
  { "name": "home-banner-button2-text", "text": 'Proyectos 2023' },
  { "name": "home-banner-button2-link", "text": '/archivo' },

  //ideas y proyectos
  { "name": "idea-title", "text": "Ideas y proyectos" },
  { "name": "idea-subtitle", "text": '¡Tenés tiempo hasta el 7 de julio a las 18hs! Subí tu idea o participá para mejorar con tus aportes otras ideas.' },

  //archivo
  { "name": "archivo-title", "text": "Archivo de proyectos" },
  { "name": "archivo-subtitle", "text": "Aquí podes visualizar los proyectos de años anteriores" },

  //votacion
  { "name": "votacion-title", "text": 'VOTACIÓN DEL PRESUPUESTO PARTICIPATIVO UNIVERSIDAD DE MAR DEL PLATA 2024' },
  { "name": "votacion-subtitle", "text": "Gracias por participar de la votación del presupuesto participativo 2024" },
  { "name": "votacion-steps", "text": "<div style='text-align: center;'><span style='font-size: 24px;'>Pasos y reglas para la votación</span></div><div class='wrapper'><br></div><ul><li class='wrapper'>Tenés <b>2 votos disponibles</b>.</li><li class='wrapper'>El <b>primer voto es obligatorio</b> y se destina a <b>tu facultad indicada al momento de registro.</b></li><li class='wrapper'>Los proyectos aparecerán automáticamente ya definidos por tu facultad</li><li class='wrapper'>El <b>segundo voto es opcional</b> y se destina a votar un proyecto de <b>cualquier facultad del municipio.</b></li></ul>" },

  //footer
  { "name": "footer-info", "text": "<span>Universidad Nacional de Mar del Plata</span><span>Diagonal J. B. Alberdi 2695</span><span>(7600) Mar del Plata</span><span>Tel.: 54.0223.492.1705 al 1710</span><span>Fax 54.223.492.1710</span><br><span class='c-white'>Email para consultas: </span><a tabindex='8' href='mailto:presupuestoparticipativo@mdp.edu.ar'>presupuestoparticipativo@mdp.edu.ar</a>" }
]

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up(done) {
  dbReady()
    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        Text.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))

          resolve()
        })
      })
    })
    // Agregamos textos
    .then(() => Text.collection.insertMany(textsData))
    // Devolvemos al Migrator (de lib/migrations)
    .then(() => {
      console.log(`-- Agregados textos de portada`)
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises)
        done()
      else {
        console.log('-- Actualizacion de textos de portada no funcionó! Error: ', err)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};