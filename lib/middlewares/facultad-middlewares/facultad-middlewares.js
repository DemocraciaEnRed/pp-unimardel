import debug from 'debug'
import facultadStore from '../../stores/facultad-store'

const log = debug('democracyos:facultad-middlewares')

export function findAllFacultades (ctx, next) {
  facultadStore
    .findAll()
    .then((facultades) => {
      ctx.facultades = facultades
      next()
    })
    .catch((err) => {
      if (err.status !== 404) throw err
      const message = 'Unable to load facultades'
      return log(message, err)
    })
}