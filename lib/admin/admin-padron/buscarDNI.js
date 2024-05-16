import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/url-builder'
import { limit } from '../../api-v2/validate/schemas/pagination'
import moment from 'moment'

export default class BuscarDNI extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inputDNI: '',
      result: null,
      selectedZone: '',
      showWarning: false,
      showSuccess: false,
      textWarning: '',
      textSuccess: '',
      showWarningCambiarFacultad: false,
      textWarningCambiarFacultad: false,
      showSuccessCambiarFacultad: '',
      textSuccessCambiarFacultad: ''
    }

    this.buscarDni = this.buscarDni.bind(this);
    this.closeNotifications = this.closeNotifications.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.cambiarFacultad = this.cambiarFacultad.bind(this);
    this.closeNotificationsCambiarFacultad = this.closeNotificationsCambiarFacultad.bind(this);
  }

  componentDidMount () {

  }

  handleInputChange (e) {
    let data = {}
    data[e.target.name] = e.target.value
    this.setState(data)
  }

  closeWarnings () {
    this.setState({
      showWarning: false
    })
  }

  buscarDni (e) {
    e.preventDefault();
    let dni = this.state.inputDNI
    this.closeNotifications()
    // it should not be empty
    if (dni.length === 0) {
      this.setState({
        showWarning: true,
        textWarning: 'El DNI no puede estar vacio',
        showWarningCambiarFacultad: false,
        textWarningCambiarFacultad: false,
        showSuccessCambiarFacultad: '',
        textSuccessCambiarFacultad: ''
      })
      return
    }
    let aux = this.state.inputDNI
    window.fetch(`/api/padron/search/dni?dni=${this.state.inputDNI}&forum=proyectos`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        return res
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if (this.isEmpty(res)){
        this.setState({
          result: null,
          showWarning: true,
          selectedZone: '',
          textWarning: `No se encontro ningun usuario con el DNI ${aux}`,
          showWarningCambiarFacultad: false,
          textWarningCambiarFacultad: false,
          showSuccessCambiarFacultad: '',
          textSuccessCambiarFacultad: ''
        })
        return
      }
      this.setState({
        result: res,
        showSuccess: true,
        selectedZone: '',
        textSuccess: `Se encontró en el padron el DNI ${aux}`,
        showWarningCambiarFacultad: false,
        textWarningCambiarFacultad: false,
        showSuccessCambiarFacultad: '',
        textSuccessCambiarFacultad: ''
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  cambiarFacultad () {
    if (this.state.selectedZone === '') {
      this.setState({
        showWarningCambiarFacultad: true,
        textWarningCambiarFacultad: 'Debe seleccionar una facultad'
      })
      return
    }
    let user = this.state.result
    let data = {
      dni: user.dni,
      facultad: this.state.selectedZone
    }
    window.fetch(`/api/padron/change-zone`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((res) => {
      if (res.status === 200) {
        return res
      }
    }
    )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        this.setState({
          showWarningCambiarFacultad: true,
          textWarningCambiarFacultad: res.error
        })
        return
      }
      let auxResult = this.state.result
      auxResult.user.facultad = this.state.selectedZone
      this.setState({
        showSuccessCambiarFacultad: true,
        textSuccessCambiarFacultad: `Se cambio la facultad del usuario ${user.dni} a ${this.getFacultad(this.state.selectedZone)}`,
        selectedZone: '',
        result: auxResult
      })
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        showWarningCambiarFacultad: true,
        textWarningCambiarFacultad: 'Ocurrió un error al cambiar de facultad al usuario'
      })
    })
  }

  // object is not empty
  isEmpty (obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  showUserData (user) {
    return (
      <div className="">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Nombre</th>
              <td>{user.lastName}, {user.firstName}</td>
            </tr>
            <tr>
              <th>DNI</th>
              <td>{user.dni}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Valido Email</th>
              <td>{user.emailValidated ? 'SI' : 'NO'}</td>
            </tr>
            <tr>
              <th>Facultad</th>
              <td>{this.getFacultad(user.facultad)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{moment(user.createdAt).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <th>ID</th>
              <td><small>{user._id}</small></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  getFacultad (idFacultad) {
    let facultad = this.props.facultades.find((facultad) => {
      return facultad.value === idFacultad
    })
    if (facultad) {
      return facultad.name
    }
    return ''
  }

  closeNotifications () {
    this.setState({
      showWarning: false,
      showSuccess: false,
      textWarning: '',
      textSuccess: ''
    })
  }
  closeNotificationsCambiarFacultad () {
    this.setState({
      showWarningCambiarFacultad: false,
      showSuccessCambiarFacultad: false,
      textWarningCambiarFacultad: '',
      textSuccessCambiarFacultad: ''
    })
  }

  render () {
    const { forum, facultades } = this.props
    // let { proyectistas } = this.state
    return (
      <div id="buscar-dni-component">
        <p className='h3'><i className="icon-search"></i> Búsqueda por DNI</p>
        <p>Puede buscar si el DNI está en el padrón, y si existe un usuario ya registrado con ese DNI, sus datos aparecerán.</p>
        <div className='panel panel-default'>
          <div className='panel-body'>
            {
              this.state.showWarning &&
              <div className='alert alert-warning alert-dismissible' role='alert'>
                <button type='button' onClick={this.closeNotifications} className='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                { this.state.textWarning }
              </div>
            }
            <div className='form-group'>
              <label htmlFor=''>DNI a buscar</label>
              <input type='text' name="inputDNI" onChange={this.handleInputChange} className='form-control' id='' placeholder='DNI' />
            </div>
            <div className='form-group pull-right'>
              <button type='button' onClick={this.buscarDni} className='btn btn-primary'>Buscar</button>
            </div>
          </div>
        </div>
        {
          this.state.showSuccess &&
          <div className='alert alert-success alert-dismissible' role='alert'>
            <button type='button' onClick={this.closeNotifications} className='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
            { this.state.textSuccess }
          </div>
        }
        {
          this.state.showSuccess && this.state.result.voted && 
          <div className='alert alert-success alert-dismissible' role='alert'>
            <i className="glyphicon glyphicon-ok"></i> El DNI ha votado en el presupuesto participativo
          </div>
        }
        {
          this.state.showSuccess && !this.state.result.voted &&
          <div className='alert alert-warning alert-dismissible' role='alert'>
            <i className="glyphicon glyphicon-info-sign"></i> El DNI no ha votado en el presupuesto participativo
          </div>
        }
        { this.state.result && (
          <div>
            <div className="row">
              { this.state.result.user ? 
                (
                <div className="col-md-6">
                  <p className='h4'><b>Usuario</b></p>
                  <div className=''>
                    {this.showUserData(this.state.result.user)}
                  </div>
                </div>
                ) : (
                  <div className="col-md-6">
                    <p className='h4'><b>Usuario</b></p>
                    <div className=''>
                      No existe un usuario registrado con este DNI
                    </div>
                  </div>
                )
              }
              {
                this.state.result.user &&
                  <div className="col-md-6">
                    <p className='h4'><b>¿Cambiar facultad?</b></p>
                    {
                      this.state.result.user && !this.state.result.user.facultad && <p>El usuario no tiene una facultad asignada... (Error?)</p>
                    }
                    {
                      this.state.showSuccess && this.state.result.voted && this.state.result.topics.length > 0 &&
                      <div className='alert alert-danger alert-dismissible' role='alert'>
                        <b>IMPORTANTE</b>: El usuario publicó proyectos con su facultad original y ya votó. <b>¡Cambiar de facultad no cambia la facultad del proyecto!</b>
                      </div>
                    }
                    {
                      this.state.showSuccess && this.state.result.voted &&
                      <div className='alert alert-warning alert-dismissible' role='alert'>
                        El usuario ya votó para la facultad que ya tiene asignada. Cambiarlo de facultad no deberia ser recomendado, ya que su voto está asociado a la facultad que tiene asignada ya.
                      </div>
                    }
                    <div className='panel panel-default'>
                      <div className='panel-body'>
                        {
                          this.state.showWarningCambiarFacultad &&
                          <div className='alert alert-warning alert-dismissible' role='alert'>
                            <button type='button' onClick={this.closeNotificationsCambiarFacultad} className='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                            { this.state.textWarningCambiarFacultad }
                          </div>
                        }
                        {
                          this.state.showSuccessCambiarFacultad &&
                          <div className='alert alert-success alert-dismissible' role='alert'>
                            <button type='button' onClick={this.closeNotificationsCambiarFacultad} className='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                            { this.state.textSuccessCambiarFacultad }
                          </div>
                        }
                        <div className='form-group'>
                          <label htmlFor=''>Nueva facultad</label>
                          <select name="selectedZone" onChange={this.handleInputChange} className='form-control' id=''>
                            <option value=''>Seleccione una facultad</option>
                            {
                              facultades.map((facultad) => {
                                return <option key={facultad.value} value={facultad.value}>{facultad.name}</option>
                              })
                            }
                          </select>
                        </div>
                        <div className='form-group pull-right'>
                          <button type='button' onClick={this.cambiarFacultad} className='btn btn-primary'>Cambiar</button>
                        </div>
                      </div>
                    </div>
                  </div>
              }
            </div>
            <div className="row">
              <div className="col-lg-12">
              { this.state.result.user && (
                <div>
                  <p className='h4'><b>Proyectos del usuario</b></p>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Facultad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.result.topics.map((topic) => {
                          return (
                            <tr key={topic.id}>
                              <td>{topic.mediaTitle}</td>
                              <td>{moment(topic.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                              <td>{(topic.facultad && topic.facultad.nombre) || '???'}</td>
                            </tr>
                          )
                        })
                      }
                      {
                        this.state.result.topics.length === 0 &&
                        <tr>
                          <td colSpan='3'>No hay proyectos del usuario</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                  </div>
                )
              }
              </div>
            </div>
          </div>
          )
        }
      </div>
    )
    }
  }