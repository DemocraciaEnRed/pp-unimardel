import React, { Component } from 'react'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import zonaStore from 'lib/stores/zona-store'

import tagStore from 'lib/stores/tag-store/tag-store'
import Tags from 'lib/admin/admin-topics-form/tag-autocomplete/component'
import Attrs from 'lib/admin/admin-topics-form/attrs/component'
import { browserHistory } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import { Link } from 'react-router'

class FormularioVoto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: null,

      forum: null,
      topic: null,

      nombre: '',
      zona: '',
      documento: '',
      // genero: '',
      email: '',
      titulo: '',
      tags: [],
      problema: '',

      state: '',
      adminComment: '',
      adminCommentReference: '',

      availableTags: [],
      zonas: [],
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange (evt) {
    evt.preventDefault()
    const { target: { value, name } } = evt
    this.setState({ [name]: value })
  }

  componentWillMount () {
    const isEdit = this.props.params.id ? true : false

    const promises = [
      // data del forum
      forumStore.findOneByName('proyectos'),
      tagStore.findAll({field: 'name'}),
      zonaStore.findAll(),
    ]

    // si es edición traemos data del topic también
    if (isEdit)
      promises.push(topicStore.findOne(this.props.params.id))

    Promise.all(promises).then(results => {
      // topic queda en undefined si no estamos en edit
      const [ forum, tags, zonas, topic] = results

      let newState = {
        forum,
        availableTags: tags,
        zonas,
        mode: isEdit ? 'edit' : 'new'
      }

      if (isEdit)
        Object.assign(newState, {
          titulo: topic.mediaTitle,
          documento: topic.attrs.documento,
          // genero: topic.attrs.genero,
          zona: topic.attrs.zona,
          problema: topic.attrs.problema,
          // los tags se guardan por nombre (¿por qué?) así que buscamos su respectivo objeto
          tags: tags.filter(t => topic.tags.includes(t.name)),
          state: topic.attrs.state,
          adminComment: topic.attrs['admin-comment'],
          adminCommentReference: topic.attrs['admin-comment-reference']
        })
      this.setState(newState, () => {
        // updateamos campos de usuario
        // (recién dps del setState tendremos zonas cargadas)
        this.props.user.onChange(this.onUserStateChange)
        // si ya está loggeado de antes debería pasar por la función igualmente
        this.onUserStateChange()
      })
      const hash = window.location.hash;
      if (hash && document.getElementById(hash.substr(1))) {
          // Check if there is a hash and if an element with that id exists
          const element = document.getElementById(hash.substr(1));
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({
               top: offsetPosition,
               behavior: "smooth"
          });
      }
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
      forum: this.state.forum.id,
      mediaTitle: this.state.titulo,
      'attrs.documento': this.state.documento,
      // 'attrs.genero': this.state.genero,
      'attrs.problema': this.state.problema,
      zona: this.state.zona,
      tags: this.state.tags.map(tag => tag.name)
    }
    if (this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit') {
      formData['attrs.admin-comment'] = this.state.adminComment
      formData['attrs.admin-comment-referencia'] = this.state.adminCommentReference
      formData['attrs.state'] = this.state.state
    }
    this.crearVoto(formData)
    // if (this.state.mode === 'new') {
    //   this.crearVoto(formData)
    // } else {
    //   this.editarVoto(formData)
    // }
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

  // editarVoto (formData) {
  //   window.fetch(`/api/v2/topics/${this.props.params.id}`, {
  //     method: 'PUT',
  //     credentials: 'include',
  //     body: JSON.stringify(formData),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then((res) => {
  //     if (res.status === 200) {
  //       window.location.href = `/votacion/${this.props.params.id}`
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
  // }

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

  hasErrors = () => {
    if (this.state.nombre === '') return true
    if (this.state.documento === '') return true
    // if (this.state.genero === '') return true
    if (this.state.email === '') return true
    if (this.state.titulo === '') return true
    if (this.state.zona === '') return true
    if (this.state.problema === '') return true
    if (!this.state.tags || this.state.tags.length == 0) return true
    return false;

  }

  hasErrorsField = (field) => {
    const val = this.state[field]
    if(val === '' || (val && val.length == 0)) return true
    return false;
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

  render () {
    const { forum, zonas } = this.state

    if (!forum) return null
    if(config.votacionAbierta || (this.state.forum.privileges && this.state.forum.privileges.canChangeTopics)) {
    return (
      <div className='form-votacion'>
        <div className='votacion-header'>
          <h1 className='text-center'>Presupuesto Participativo General pueyrredon 2022</h1>
          <p>¡Compartinos tus ideas para mejorar nuestra comunidad!</p>
          {//<p>¡Gracias a todos y todas por participar!</p>
          }
        </div>
        {/* FORMULARIO GOES BEHIND THIS */}
        <form className='wrapper' onSubmit={this.handleSubmit}>
          <div className="bar-section">
            <p className="section-title">Tus datos</p>
            <p className="section-subtitle">Todos estos datos son confidenciales</p>
          </div>
          <input type='hidden' name='forum' value={forum.id} />
          <div className='form-group'>
            <label className='required' htmlFor='nombre'>
              Nombre y apellido
            </label>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='nombre'
              value={this.state['nombre']}
              placeholder=""
              onChange={this.handleInputChange}
              disabled={true} />
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='zona'>
              Zona
            </label>
            <select
              className='form-control'
              required
              name='zona'
              value={this.state['zona']}
              onChange={this.handleInputChange}
              disabled={true}>
              <option value=''>Seleccione una zona</option>
              {zonas.length > 0 && zonas.map(zona =>
                <option key={zona._id} value={zona._id}>
                  {zona.nombre}
                </option>
              )}
            </select>
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='documento'>
              DNI
            </label>
            <input
              className='form-control'
              required
              type='text'
              max='50'
              name='documento'
              placeholder=""
              value={this.state['documento']}
              onChange={this.handleInputChange}
              disabled={true}/>
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='email'>
              Email
            </label>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='email'
              placeholder=""
              value={this.state['email']}
              onChange={this.handleInputChange}
              disabled={true} />
          </div>

          <div id="acerca-votacion" className="bar-section acerca-votacion">
              <p className="section-title">Acerca de tu idea</p>
          </div>

          <section>
          <div className='form-group'>
            <label className='required' htmlFor='titulo'>
              Título
            </label>
            <p className="help-text">Elegí un título</p>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='titulo'
              value={this.state['titulo']}
              onChange={this.handleInputChange} />
          </div>
          <div className='tags-autocomplete'>
            <label className='required'>
                Temas
            </label>
            <p className='help-text'>Elegí los temas relacionados a tu idea. Recordá que podés seleccionar una sola opción.</p>
            {
              this.state.mode === 'edit' && this.state.tags &&
                <ul className="tags">
                {
                  this.state.availableTags.map((tag) => {
                    return (
                      <li key={tag.id}><span onClick={this.toggleTag(tag)} value={tag.id} className={this.state.tags.includes(tag) ? 'tag active' : 'tag'}>{tag.name}</span></li>
                    )
                  })
                }
                </ul>
            }
            {
              this.state.mode === 'new' &&
                <ul className="tags">
                {
                  this.state.availableTags.map((tag) => {
                    return (
                      <li key={tag.id}><span onClick={this.toggleTag(tag)} value={tag.id} className={this.state.tags.includes(tag) ? 'tag active' : 'tag'}>{tag.name}</span></li>
                    )
                  })
                }
                </ul>
            }
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='problema'>
              Tu idea
            </label>
              <p className='help-text'>¿Qué querés proponer? ¿Para qué? ¿Quiénes se ven beneficiado/as?</p>
            {/*<p className='help-text'><strong>Recordá ingresar solo una idea por formulario</strong></p>*/}
            <textarea
              className='form-control'
              required
              placeholder='Ejemplo N°1: Propongo la construcción de barandas para senderos peatonales para cuidar los ambientes protegidos del Parque Natural. Este proyecto beneficiará a toda la comunidad brindando una mejor accesibilidad hacia los diferentes sectores de observación dentro del Parque Natural.&#10;Ejemplo N°2: Propongo la instalación de dos nuevos juegos en la plaza de la zona para garantizar la distancia social necesaria por el COVID-19. Este proyecto beneficiará a todos los niños y niñas de la zona.'
              rows='7'
              max='5000'
              name='problema'
              value={this.state['problema']}
              onChange={this.handleInputChange}>
            </textarea>
          </div>
          {this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit' && (
            <div className='form-group'>
              <label htmlFor='state'>Estado</label>
              <span className='help-text requerido'>Agregar una descripción del estado del proyecto</span>
              <select
                className='form-control special-height'
                name='state'
                value={this.state['state']}
                onChange={this.handleInputChange}>
                <option value='pendiente'>Pendiente</option>
                <option value='factible'>Factible</option>
                <option value='no-factible'>No factible</option>
                <option value='integrado'>Integrada</option>
              </select>
            </div>
          )}
          {this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit' && (
            <div className='form-group'>
              <label htmlFor='adminComment'>Comentario del moderador:</label>
              <span className='help-text requerido'>Escribir aquí un comentario en el caso que se cambie el estado a "factible", "rechazado" o "integrado"</span>
              <textarea
                className='form-control'
                rows='6'
                max='5000'
                name='adminComment'
                value={this.state['adminComment']}
                onChange={this.handleInputChange}>
              </textarea>
            </div>
          )}
          {this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit' && (
            <div className='form-group'>
              <label htmlFor='adminCommentReference'>Link a la votacion definitiva:</label>
              <span className='help-text requerido'>Escribir aquí el link al proyecto vinculado, en caso que se cambie el estado a "integrado"</span>
              <input
                type='text'
                className='form-control'
                name='adminCommentReference'
                value={this.state['adminCommentReference']}
                onChange={this.handleInputChange} />
            </div>
          )}
          {
             this.hasErrors() &&
             <div className="error-box">
             <ul>
                    {this.hasErrorsField('nombre') && <li className="error-li">El campo "Nombre y apellido" no puede quedar vacío</li> }
                    {this.hasErrorsField('documento') && <li className="error-li">El campo "DNI" no puede quedar vacío</li> }
                    {/* {this.hasErrorsField('genero') && <li className="error-li">El campo "Género" no puede quedar vacío</li> } */}
                    {this.hasErrorsField('email') && <li className="error-li">El campo "Email" no puede quedar vacío</li> }
                    {this.hasErrorsField('titulo') && <li className="error-li">El campo "Título" no puede quedar vacío</li> }
                    {this.hasErrorsField('zona') && <li className="error-li">El campo "Zona" no puede quedar vacío</li> }
                    {this.hasErrorsField('tags') && <li className="error-li">El campo "Temas" no puede quedar vacío</li> }
                    {this.hasErrorsField('problema') && <li className="error-li">El campo "Tu idea" no puede quedar vacío</li> }
             </ul>
             </div>
          }
          <div className='submit-div'>
            { !this.hasErrors() &&
              <button type='submit' className='submit-btn'>
                {this.state.mode === 'new' ? 'Enviar idea' : 'Guardar idea'}
              </button>
            }
          </div>
          <p className="more-info add-color">¡Luego de mandarla, podés volver a editarla!</p>
          </section>
        </form>
      </div>
    )

    } return (
      <div className='form-votacion'>
        <div className='votacion-header'>
          <h1 className='text-center'>Presupuesto Participativo General pueyrredon 2022</h1>
          {/* <p>¡Acá vas a poder subir tu votacion para el presupuesto participativo!</p> */}
          <p>Gracias por participar de la votacion del presupuesto participativo 2022</p>
        </div>
        {/* ALERT PARA FIN DE ETAPA */}
        <alert className='alert alert-info cronograma'>
          <Link style={{ display: 'inline' }} to='/s/acerca-de?scroll=cronograma'>
            La etapa de votacion ya ha sido cerrada. ¡Muchas gracias por participar!
          </Link>
        </alert>
     </div>
    )
  }
}

export default userConnector(FormularioVoto)
