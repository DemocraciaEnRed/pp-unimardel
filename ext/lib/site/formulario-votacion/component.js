import React, { Component } from 'react'
import config from 'lib/config'

import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import zonaStore from 'lib/stores/zona-store'
import voteStore from 'lib/stores/vote-store'
import tagStore from 'lib/stores/tag-store/tag-store'

import { browserHistory } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import Close from "./steps/close"
import SelectVoter from "./steps/select-voter"
import Info from "./steps/info"
import VotoZona from "./steps/votoZona"
import VotoCualquierZona from "./steps/votoCualquierZona"
import Confirmacion from "./steps/confirmacion"
import Agradecimiento from "./steps/agradecimiento"
import Welcome from "./steps/bienvenida"

class FormularioVoto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forumAndTopicFetched: false,
      forum: null,
      step:0,
      warning: {},
      hasVoted: '',

      //  Datos de usuario
      userFetched: false,
      dni: '',
      zona: '',
      nombre: '',
      documento: '',
      email: '',

      // Control for Step 0
      notInPadron: null,
      differentZone: null,
      searchedUser: null,
      noUser: null,

      //  Votos
      // Se decidieron estos nombres por si cambia el criterio de asignación en el futuro
      voto1: null,
      voto2: null,
      
      topics: [],

      // Para filtros
      tags: [],
      zonas: [],
      activeTags: [],
      activeZonas: [],
      userPrivileges: null
    }

    props.user.onChange(this.onUserStateChange)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCheckboxInputChange = this.handleCheckboxInputChange.bind(this)
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
        tags,
        zonas,
        topics,
        forumAndTopicFetched: true
      }
      this.setState(newState)
    }).catch(err =>
      console.error(err)
    )
  }

  // componentDidUpdate () {
  //   const {userPrivileges, dni, zona, step, hasVoted, fetched } = this.state
  //   const { user } = this.props
  //   // if fetched is true, we have already fetched the user data
  //   if (
  //     !userPrivileges && dni === "" && zona === "" &&
  //     user.state.value && user.state.value.zona && user.state.value.dni
  //     ) {
  //         this.setState({
  //           zona: user.state.value.zona.id,
  //           dni: user.state.value.dni,
  //           fetched: true
  //         })
  //         if (step === 0) {
  //           this.changeStep(1)
  //         }
        
  //   }
  //   if (
  //     step === 1 && dni !== "" && hasVoted === ""
  //   ) {
  //     voteStore.hasVoted(dni)
  //     .then(
  //       hasVoted => {
  //         hasVoted === "no" ? 
  //         this.setState({ hasVoted, fetched: true }) :
  //         this.setState({ 
  //           hasVoted,
  //           fetched: true, 
  //           step: 6
  //         })
          
  //       }
  //     )


  //   }

  // }

  onUserStateChange = () => {
    // if already fetched
    if (this.state.userFetched) return

    const { step, dni, hasVoted } = this.state
    const { user } = this.props

    if (!user.state.value.staff) {
      // !userPrivileges && dni === "" && zona === "" &&
      // user.state.value && user.state.value.zona && user.state.value.dni
      voteStore.hasVoted(user.state.value.dni)
      .then((hasVoted) => {
        if (hasVoted === "yes") {
          this.setState({
            zona: user.state.value.zona.id,
            dni: user.state.value.dni,
            userFetched: true,
            hasVoted,
            step: 6
          })
        } else {
          this.setState({
            zona: user.state.value.zona.id,
            dni: user.state.value.dni,
            userFetched: true,
            hasVoted,
            step: 1
          })
        }
      })
    } else {
      this.setState({
        userFetched: true
      })
    }
    // if (this.props.user.state.fulfilled){
    //   forumStore.findOneByName(config.forumProyectos).then(
    //     forum => this.setState({ userPrivileges: forum.privileges.canChangeTopics })
    //   )
    // }
  }
  
  handleSubmit (e) {
    e.preventDefault()
    const { forum, dni, zona, voto1, voto2, userPrivileges } = this.state
    const { user } = this.props
    const formData = {
      forum: forum.id,
      user: user.state.value.id,
      dni,
      zona,
      userPrivileges,
      voto1,
      voto2
    }
    voteStore.sendVotes(formData)
    .then((vote) => {
      this.changeStep(this.state.step + 1)
    })
  }

  handleCheckboxInputChange(event) {
    const { target: { value, name, checked } } = event
    this.setState({
      [name]: checked ? value : null
    });
  }

  componentWillUpdate () {
    if (this.props.user.state.rejected) {
      browserHistory.push('/signin?ref=/votacion')
    }
  }  

  handleFilter = (filter, value) => {
    if (!this.state[filter].includes(value)) {
      this.setState({
        [filter]: [...this.state[filter], value]
      })
    } else {
      this.setState({
        [filter]: [...this.state[filter]].filter((item) => item !== value)
      })
    }

}

  handleDefaultFilter = (filter, value) => {
    this.setState({
      [filter]: [value]
    })
  }

  // Clear all selected items from a filter
  clearFilter = (filter) => {
    this.setState({
      [filter]: []
    })
  }

  changeStep = (step) => {
    this.setState({step})
  }

  renderStep = (step) => {
    switch (step) {
      case 0:
        return <SelectVoter zonas={this.state.zonas} setState={this.handleInputChange} />
      case 1:
        return <Welcome changeStep={() => this.changeStep(this.state.step+1)} />
      case 2:
        return <Info />
      case 3:
        return <VotoZona 
          topics={this.state.topics.filter(t => t.zona.id === this.state.zona)} 
          handler="voto1"
          selected={this.state.voto1}
          setState={this.handleCheckboxInputChange} 
          // Filters
          tags={this.state.tags}
          activeTags={this.state.activeTags}
          handleFilter={this.handleFilter}
          handleDefaultFilter={this.handleDefaultFilter}
          clearFilter={this.clearFilter}
        />
      case 4:
        return <VotoCualquierZona 
          topics={this.state.topics.filter(t => t.id !== this.state.voto1)} 
          handler="voto2"
          selected={this.state.voto2}
          setState={this.handleCheckboxInputChange} 
          tags={this.state.tags}
          activeTags={this.state.activeTags}
          zonas={this.state.zonas}
          activeZonas={this.state.activeZonas}
          handleFilter={this.handleFilter}
          handleDefaultFilter={this.handleDefaultFilter}
          clearFilter={this.clearFilter}
        />
      case 5:
        return <Confirmacion
          topics={this.state.topics.filter(t => [this.state.voto1, this.state.voto2].includes(t.id))} 
        />
      case 6:
        return <Agradecimiento dni={this.state.dni} hasVoted={this.state.hasVoted} />
      default:
        return <Close />

    }
  }

  checkWarning = () => {
    const { step, dni, zona, voto1, voto2, notInPadron, noUser, hasVoted, differentZone, searchedUser, zonas } = this.state

    switch (step) {
      case 0:
        if (!dni || !zona) {
          return {
            message: 'Los campos "DNI" y "Zona de Residencia" no pueden quedar vacíos',
            canPass: false
          }
        } else if (notInPadron === true){
          // if user already voted, show warning and cant pass through
          return {
            message: `El usuario con DNI ${dni} no se encuentra en el padrón, se lo agregará al mismo con el voto.`,
            canPass: true
          }
        } else if (noUser === true) {
          return {
            message: `Se encontró el ${dni} en el padrón. No se registró en la plataforma. Puede continuar.`,
            canPass: true
          }
        } else if (hasVoted === true) {
          return {
            message: `El usuario con DNI ${dni} ya votó anteriormente. No pueden continuar.`,
            canPass: false
          }
        } else if (differentZone === true) {
          return {
            message: `El usuario con DNI ${dni} declaró como zona "${zonas.find(z => z.id === searchedUser.zona).nombre}".`,
            canPass: true
          }
        } else {
          return {}
        }

      case 3:
        return !voto1 ? {
          message: 'El primer voto es obligatorio y se destina a tu zona indicada al momento de registro',
          canPass: false
        } : {}
      case 4:
        return !voto2 ? {
          message: 'No has elegido ningún proyecto, esto se considerará como VOTO EN BLANCO.',
          canPass: true
        } : {}        
      default:
        return {}
    }
  }

  handleNext = () => {
    const { step, dni, zona } = this.state
    if(step == 0){
      this.setState({
        notInPadron: null,
        hasVoted: null,
        noUser: null,
        differentZone: null,
        searchedUser: null
      }, () => {
        window.fetch(`api/padron/search/dni?dni=${dni}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(res => res.json())
        .then(res => {
          // if response is an empty object
          if (Object.keys(res).length === 0){
            // then user is not in padron
            this.setState({
              notInPadron: true
            })
          } else if (res.voted && res.voted === true) {
            // then user has voted
            this.setState({
              hasVoted: true
            })
          } else if (res && !res.user){
            // the dni is in padron but there is no user
            this.setState({
              noUser: true
            })
          } else if (res && res.user && zona != res.user.zona){
            // user is in padron, but declared a differnet zone
            this.setState({
              differentZone: true,
              searchedUser: res.user
            })
          }
          const warning = this.checkWarning()
          warning && warning.message ? this.setState({warning: warning}) : this.changeStep(step + 1)
        })
      })
      // add dni as query
    } else {
      const warning = this.checkWarning()
      warning && warning.message ? this.setState({warning: warning}) : this.changeStep(step + 1)
    }
  }

  closeDialog = () => {
    this.setState({warning: {}})
  }

  performNext = (canPass, step) => {
    this.closeDialog()
    
    if (canPass) {
      this.changeStep(step+1)
    }

  }

  render () {
    const { forum, step, warning, forumAndTopicFetched, userFetched } = this.state
    if (!forum) return null
    if (!config.votacionAbierta) return <Close />

    if (!forumAndTopicFetched || !userFetched) return (<p>Loading...</p>)

    const confirm = 5
    const welcome = 1
    const hasWarning = Object.keys(warning).length > 0

    return (
      <div>
        {hasWarning && <dialog
                    className='dialog-votacion text-center'
                    open
                >
                    <h5>{warning.message}</h5>
                    <button className='btn btn-cancelar' onClick={() => this.closeDialog()}>Cancelar</button>
                    <button className='btn btn-entendido' onClick={() => this.performNext(warning.canPass, step)}>Entendido</button>
                </dialog>
          }
      <div className={`form-votacion ${hasWarning ? "blur" : ""}`}> 
        {
          step > welcome && <div className='step-tracker'>
          {[1,2,3,4].map((s, index) => (<div key={index} >
            {s > 1 && <span className={`step-line${step-1 >= s ? "-past" : ""}`} />}
            <span 
            className={`step-${s} ${step-1 === s ? "active" : (step-1 > s ? "past" : "")}`}>
              {s}
            </span>
          </div>))}
        </div>
        } 
        {this.renderStep(step)}
        {config.votacionAbierta && step !== welcome && step <= confirm && (
          <div className='footer-votacion'>
            <button className='button-anterior' disabled={step <= welcome ? true : false} onClick={() => this.changeStep(step - 1)}>
              <span className='icon-arrow-left-circle'></span> Anterior
            </button>
            {step === confirm ?
            <button className='button-siguiente' onClick={this.handleSubmit}>
              Enviar Votos <span className='icon-like'></span>
            </button> :
            <button 
              className='btn button-siguiente'
              onClick={() => this.handleNext()}
            >
              Siguiente <span className='icon-arrow-right-circle'></span>
            </button>
            }
          </div>
        )}
     </div>
      </div>

    )
  }
}

export default userConnector(FormularioVoto)
