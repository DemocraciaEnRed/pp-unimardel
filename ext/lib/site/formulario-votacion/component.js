import React, { Component } from 'react'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import zonaStore from 'lib/stores/zona-store'

import tagStore from 'lib/stores/tag-store/tag-store'
import { browserHistory } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import Close from "./steps/close"
import SelectVoter from "./steps/select-voter"
import Info from "./steps/info"
import VotoZona from "./steps/votoZona"
import VotoOtraZona from "./steps/votoOtraZona"
import Confirmacion from "./steps/confirmacion"
import Agradecimiento from "./steps/agradecimiento"

class FormularioVoto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      step:0,

      //  Datos de usuario
      zona: '',
      nombre: '',
      documento: '',
      email: '',

      //  Votos
      // Se decidieron estos nombres por si cambia el criterio de asignación en el futuro
      voto1: null,
      voto2: null,
      
      topics: [],

      // Para filtros
      tags: [],
      availableTags: [],
      zonas: [],
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderStep = this.renderStep.bind(this)
    this.changeStep = this.changeStep.bind(this)
  }

  handleInputChange (evt) {
    evt.preventDefault()
    const { target: { value, name } } = evt
    this.setState({ [name]: value })
  }

  componentWillMount () {

    const promises = [
      // data del forum
      forumStore.findOneByName('proyectos'),
      tagStore.findAll({field: 'name'}),
      zonaStore.findAll(),
      topicStore.findAllProyectos(),
    ]

    Promise.all(promises).then(results => {
      // topic queda en undefined si no estamos en edit
      const [ forum, tags, zonas, topics ] = results
      let newState = {
        forum,
        availableTags: tags,
        zonas,
        topics,
      }
      this.setState(newState)
    }).catch(err =>
      console.error(err)
    )
  }

  onUserStateChange = () => {
    if (this.props.user.state.fulfilled){
      let user = this.props.user.state.value
      this.setState({
        zona: user.zona._id,
        email: user.email,
        documento: user.dni,
        nombre: user.firstName + ' ' + user.lastName
      })
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    const formData = {

    }
    this.crearVoto(formData)
  }

  crearVoto = (formData) => {
    window.fetch(`/api/v2/topics`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 200) {
        window.location.href = `/votacion/${res.results.id}`
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  toggleTag = (tag) => (e) => {
    // If is inside state.tags, remove from there
    this.setState((state) => {
      let theTags = state.tags
      if(theTags.includes(tag)){
        return { tags: theTags.filter(t => t !== tag)}
      }else if(theTags.length < 1)
        theTags.push(tag)
      return { tags: theTags }
    })
  }

  handleCheckboxInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentWillUpdate (props, state) {
    if (this.props.user.state.rejected) {
      browserHistory.push('/signin?ref=/votacion')
    }
  }

  changeStep = (step) => {
    this.setState({step})
  }

  renderStep = () => {
    const handlerSetp = {
      0: <SelectVoter />,
      1: <Info />,
      2: <VotoZona />,
      3: <VotoOtraZona />,
      4: <Confirmacion />,
      5: <Agradecimiento />,
    }
    return handlerSetp[this.state.step]
  }

  render () {
    const { forum, topics, step  } = this.state

    if (!forum) return null
    return (
      <div className='form-votacion'>
        {
          config.votacionAbierta ? 
          this.renderStep() :
          <Close />
        }

        {config.votacionAbierta && (
          <div>
            <button disabled={step === 0 ? true : false} onClick={() => this.changeStep(step - 1)}>Anterior</button>
            <button disabled={step === 5 ? true : false} onClick={() => this.changeStep(step + 1)}>Siguiente</button>
          </div>
        )}
     </div>
    )
  }
}

export default userConnector(FormularioVoto)
