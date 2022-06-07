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
import Welcome from "./steps/bienvenida"

class FormularioVoto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      step:0,

      //  Datos de usuario
      dni: '',
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
      userPrivileges: null
    }

    props.user.onChange(this.onUserStateChange)

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

  componentDidUpdate () {
    if (
      !this.state.userPrivileges && this.state.dni === "" && this.state.zona === "" &&
      this.props.user.state.value && this.props.user.state.value.zona && this.props.user.state.value.dni

      ) {
          this.setState({
            zona: this.props.user.state.value.zona.id,
            dni: this.props.user.state.value.dni
          })
    }

  }

  onUserStateChange = () => {
    if (this.props.user.state.fulfilled){
      forumStore.findOneByName(config.forumProyectos).then(
        forum => this.setState({ userPrivileges: forum.privileges.canChangeTopics })
      )
    }
  }
  
  handleSubmit (e) {
    e.preventDefault()
    const formData = {

    }
    // this.crearVoto(formData)
    console.log("archivese")
    this.changeStep(this.state.step + 1)    
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

  componentWillUpdate () {
    if (this.props.user.state.rejected) {
      browserHistory.push('/signin?ref=/votacion')
    }
  }  

  changeStep = (step) => {
    this.setState({step})
  }

  fetchSteps = (userPrivileges) => {
    const steps = []
    if (userPrivileges) {
      steps.push(<SelectVoter zonas={this.state.zonas} setState={this.handleInputChange} />)
    }
    steps.push(<Welcome changeStep={() => this.changeStep(this.state.step+1)} />)
    steps.push(<Info />)
    steps.push(<VotoZona topics={this.state.topics.filter(t => t.zona.id === this.state.zona)} />)
    steps.push(<VotoOtraZona topics={this.state.topics.filter(t => t.id !== this.state.voto1)} />)
    steps.push(<Confirmacion />)
    steps.push(<Agradecimiento />)
    return steps
  }

  renderStep = (userPrivileges, step) => {
    return this.fetchSteps(userPrivileges)[step]
  }

  render () {
    const { forum, topics, step, userPrivileges  } = this.state
    if (!forum) return null

    let steps = Array.from(Array(this.fetchSteps(userPrivileges).length).keys())
    steps.shift()
    steps.pop()
    const welcome = userPrivileges ? 2 : 1
    const pondera = userPrivileges ? -1 : 0

    return (
      <div className='form-votacion'> 
        {
          config.votacionAbierta && step >= welcome && <div className='step-tracker'>
          {[1,2,3,4].map((s, index) => (<div>
            {s > 1 && <span className={`step-line${step+pondera >= s ? "-past" : ""}`} />}
            <span 
            key={index} 
            className={`step-${s} ${step+pondera === s ? "active" : (step+pondera > s ? "past" : "")}`}>
              {s}
            </span>
          </div>))}
        </div>
        } 

        {
          config.votacionAbierta ? 
          this.renderStep(userPrivileges, step) :
          <Close />
        }
        {config.votacionAbierta && step !== steps.length+1 && step !== welcome-1 && (
          <div className='footer-votacion'>
            <button className='button-anterior' disabled={step <= welcome ? true : false} onClick={() => this.changeStep(step - 1)}>
              <span className='icon-arrow-left-circle'></span> Anterior
            </button>
            {step === steps.length ?
            <button className='button-siguiente' onClick={this.handleSubmit}>
              Enviar Votos <span className='icon-like'></span>
            </button> :
            <button className='button-siguiente' disabled={step === steps.length+1 ? true : false} onClick={() => this.changeStep(step + 1)}>
              Siguiente <span className='icon-arrow-right-circle'></span>
            </button>
            }
          </div>
        )}
     </div>
    )
  }
}

export default userConnector(FormularioVoto)
