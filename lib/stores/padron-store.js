import Store from './store/store'

class PadronStore extends Store {
  name () {
    return 'padron'
  }

  findAllSuffix () {
    return ''
  }
}


export default new PadronStore()
