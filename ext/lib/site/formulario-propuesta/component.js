import React, { Component } from 'react'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import facultadStore from 'lib/stores/facultad-store'
import claustroStore from 'lib/stores/claustro-store'
import tagStore from 'lib/stores/tag-store/tag-store'
import Tags from 'lib/admin/admin-topics-form/tag-autocomplete/component'
import Attrs from 'lib/admin/admin-topics-form/attrs/component'
import { browserHistory } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import { Link } from 'react-router'

// const PROPOSALS_FORUM_NAME = 'propuestas'







class FormularioPropuesta extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: null,

      forum: null,
      topic: null,

      nombre: '',
      claustro: '',
      facultad: '',
      documento: '',
      // genero: '',
      email: '',
      titulo: '',
      tag: '',
      problema: '',
      solucion: '',
      beneficios: '',
      requirementsAccepted: false,
      
      state: '',
      adminComment: '',
      adminCommentReference: '',
      
      availableTags: [],
      facultades: [],
      claustros: []

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
      tagStore.findAll(),
      facultadStore.findAll(),
      claustroStore.findAll(),
    ]

    // si es edición traemos data del topic también
    if (isEdit)
      promises.push(topicStore.findOne(this.props.params.id))

    Promise.all(promises).then(results => {
      // topic queda en undefined si no estamos en edit
      const [forum, tags, facultades, claustros, topic] = results
      let newState = {
        forum,
        availableTags: tags,
        facultades,
        claustros,
        mode: isEdit ? 'edit' : 'new'
      }

      if (isEdit)
        Object.assign(newState, {
          titulo: topic.mediaTitle,
          documento: topic.attrs.documento,
          // genero: topic.attrs.genero,
          facultad: topic.facultad._id,
          claustro: topic.attrs.claustro,
          tag: topic.tag,
          problema: topic.attrs.problema,
          solucion: topic.attrs.solucion,
          beneficios: topic.attrs.beneficios,
          state: topic.attrs.state,
          adminComment: topic.attrs['admin-comment'],
          adminCommentReference: topic.attrs['admin-comment-reference'],
        })
      this.setState(newState, () => {
        // updateamos campos de usuario
        // (recién dps del setState tendremos facultades y claustros cargados))
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
        // facultad: user.facultad._id,
        claustro: user.claustro._id,
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
      tag: this.state.tag.id,
      'attrs.documento': this.state.documento,
      // 'attrs.genero': this.state.genero,
      'attrs.problema': this.state.problema,
      'attrs.solucion': this.state.solucion,
      'attrs.beneficios': this.state.beneficios,
      facultad: this.state.facultad,
      claustro: this.state.claustro
    }
    if (this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit') {
      formData['attrs.admin-comment'] = this.state.adminComment
      formData['attrs.admin-comment-referencia'] = this.state.adminCommentReference
      formData['attrs.state'] = this.state.state
    }
    if (this.state.mode === 'new') {
      this.crearPropuesta(formData)
    } else {
      this.editarPropuesta(formData)
    }
  }

  crearPropuesta = (formData) => {
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
        window.location.href = `/propuestas/topic/${res.results.topic.id}`
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  editarPropuesta (formData) {
    window.fetch(`/api/v2/topics/${this.props.params.id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        window.location.href = `/propuestas/topic/${this.props.params.id}`
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  toggleTag = (tag) => (e) => {
    // If is inside state.tags, remove from there
    const currentTag = this.state.tag
    this.setState((state) => {
      if (currentTag === '') {
        return {tag}
      } else if (currentTag.id === tag.id){
        return { tag: ''}
      }
    })
  }

  hasErrors = () => {
    if (this.state.nombre === '') return true
    if (this.state.documento === '') return true
    // if (this.state.genero === '') return true
    if (this.state.email === '') return true
    if (this.state.titulo === '') return true
    if (this.state.problema === '') return true
    if (this.state.tag === '' ) return true
    if (this.state.claustro === '') return true
    if (this.state.solucion === '') return true
    if (this.state.beneficios === '') return true
    if (this.state.facultad === '') return true
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
      browserHistory.push('/signin?ref=/formulario-idea')
    }
  }

  render () {
    const { forum, facultades, claustros, requirementsAccepted } = this.state

    if (!forum) return null
    if(forum.config.propuestasAbiertas || (this.state.forum.privileges && this.state.forum.privileges.canChangeTopics)) {
    return (
      <div className='form-propuesta'>
        <div className='propuesta-header'>
          <h1 className='text-center'>Formulario para enviar ideas</h1>
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
            <label className='required' htmlFor='claustro'>
              Claustro
            </label>
            <select
              className='form-control special-height'
              required
              name='claustro'
              value={this.state['claustro']}
              onChange={this.handleInputChange}
              disabled={true}>
              <option value=''>Seleccione un claustro</option>
              {claustros.length > 0 && claustros.map(claustro =>
                <option key={claustro._id} value={claustro._id}>
                  {claustro.nombre}
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

          <div className="bar-section acerca-propuesta">
              <p className="section-title">Acerca de la idea</p>
          </div>
          <div className="bar-section acerca-requisitos">
              <p className='section-title'>Requisitos para que las propuestas sean factibles</p>
          </div>

          <div className="bullet-requisitos">
            <ul>
              <li>Serán factibles las propuestas de obras o equipamiento para entidades sin fines de lucro (sociedades de fomento, centros de jubilados, asociaciones civiles, etc.) para espacios públicos y para escuelas de gestión pública provincial.</li>
              <li>Serán factibles campañas o talleres sobre un tema específico cuya ejecución sólo sea durante el 2025.</li>
              <li>No serán factibles las propuestas que impliquen un gasto corriente (recursos humanos que incrementen la planta municipal).</li>
              <li>Cada propuesta se debe presentar para un solo barrio. (No se puede presentar una propuesta para todo el Municipio)</li>
              <li>El presupuesto máximo de la propuesta no puede superar los $ 10.000.000.</li>
            </ul>
              
          </div>
          <div className="row ideas-no-factibles">
            <div className="col-sm-4 ">
              <div className="idea-no-factible">
                <img src="/ext/lib/site/formulario-propuesta/no-factible.png" alt="Ícono propuesta no factible"/>
                <p>“Asfaltar todas las calles MGP”</p>
              </div>
            </div>
            <div className="col-sm-4 ">
              <div className="idea-no-factible">
                <img src="/ext/lib/site/formulario-propuesta/no-factible.png" alt="Ícono propuesta no factible"/>
                <p>“Dictar clases de xxxx los sabados en la rambla”</p>
              </div>
            </div>
            <div className="col-sm-4 ">
              <div className="idea-no-factible">
                <img src="/ext/lib/site/formulario-propuesta/no-factible.png" alt="Ícono propuesta no factible"/>
                <p>“Mas personal en los centros municipales”</p>
              </div>
            </div>
          </div>
          <div className="row ideas-factibles">
            <div className="col-sm-4 ">
              <div className="idea-factible">
                <img src="/ext/lib/site/formulario-propuesta/factible.png" alt="Ícono propuesta no factible"/>
                <p>“Poner juego en la Plaza zxy”</p>
              </div>
            </div>
            <div className="col-sm-4 ">
              <div className="idea-factible">
                <img src="/ext/lib/site/formulario-propuesta/factible.png" alt="Ícono propuesta no factible"/>
                <p>“Camaras de seguridad en xxx”</p>
              </div>
            </div>
            <div className="col-sm-4 ">
              <div className="idea-factible">
                <img src="/ext/lib/site/formulario-propuesta/factible.png" alt="Ícono propuesta no factible"/>
                <p>“Colocar una plaza en el predio de la calle xxx”</p>
              </div>
            </div>

          </div>
                        
          <hr />
          
          <p className='aceptar-tyc'>Para comenzar a completar el formulario, debe aceptar los términos y condiciones</p>


          { !requirementsAccepted && <div className="bar-section">
            <button type="button" className='btn-requirements-accepted' onClick={() => {this.setState({requirementsAccepted: !requirementsAccepted})}}>
              Mi idea cumple con todo
            </button>
          </div>
          }
          

          

          { requirementsAccepted && <section>
          
            {/* <div className="bar-section acerca-requisitos mt-6">
            <p className='section-title'>Contanos sobre tu idea</p>
          </div> */}


          <div className='form-group mt-5'>
            <label className='required' htmlFor='titulo'>
              * Título de la idea
              </label>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='titulo'
              value={this.state['titulo']}
              onChange={this.handleInputChange} />
            </div>       
            <div className='form-group'>
              <label htmlFor='facultad'>
                Para que facultad es tu idea? (Si no aplica, dejalo en blanco)
              </label>
              <select
                className={`form-control ${this.state['facultad'] && "facultad-selected"}`}
                name='facultad'
                value={this.state['facultad']}
                onChange={this.handleInputChange}
              >
                <option value=''>Seleccione una facultad...</option>
                {facultades.length > 0 && facultades.map(facultad =>
                  <option key={facultad._id} value={facultad._id}>
                    {facultad.nombre}
                  </option>
                )}
              </select>
            </div>
            <div className='tags-autocomplete'>
            <label className='required'>
              * Tipo de proyecto
            </label>
              <p className='help-text'>Elegi un tipo de proyecto para tu idea</p>
            {
              this.state.mode === 'edit' && this.state.availableTags && <div>
                <ul className="tags">
                {
                  this.state.availableTags.filter(tag => tag.hash !== "ideas-para-organizaciones/clubes").map((tag) => {
                    return (
                      <li key={tag.id}><span onClick={this.toggleTag(tag)} value={tag.id} className={this.state.tag.id === tag.id ? 'tag active' : 'tag'} style={{ backgroundColor: this.state.tag.id === tag.id ? tag.color : '' }} ><i className={"fa fa-" + tag.image} aria-hidden="true"></i> {tag.name}</span></li>
                    )
                  })
                }
                </ul>

              </div>
            }
            {
              this.state.mode === 'new' && <div>
                <ul className="tags">
                {
                  this.state.availableTags.filter(tag => tag.hash !== "ideas-para-organizaciones/clubes").map((tag) => {
                    return (
                      <li key={tag.id}><span onClick={this.toggleTag(tag)} value={tag.id} className={this.state.tag.id === tag.id ? 'tag active' : 'tag'} style={{ backgroundColor: this.state.tag.id === tag.id ? tag.color : '' }} ><i className={"fa fa-" + tag.image} aria-hidden="true"></i> {tag.name}</span></li>
                    )
                  })
                }
                </ul>

                </div>
              }
            </div>
            <div className='form-group'>
              <label className='required' htmlFor='problema'>
                * Problema o necesidad existente
              </label>
              <p className='help-text'>¿Qué problemas querés resolver? ¿a quiénes afecta? ¿Cómo?</p>
              {/*<p className='help-text'><strong>Recordá ingresar solo una idea por formulario</strong></p>*/}
              <textarea
                className='form-control'
                required
                rows='7'
                max='5000'
                name='problema'
                value={this.state['problema']}
                onChange={this.handleInputChange}>
              </textarea>
            </div>
          
          {this.state.tag && this.state.tag.hash === "ideas-para-organizaciones/clubes" && <div className="disclaimer-orgas mb-3">
          Las <b>ideas dirigidas a mejorar o equipar organizaciones serán evaluadas internamente</b> en primera instancia, y luego de aprobadas podrán avanzar a siguientes etapas. <br />
          <b>NO serán factibles aquellas ideas que impliquen entregar equipamiento o construcción/refacción del inmueble.</b>
          </div>}

          <div className='form-group'>
            <label className='required' htmlFor='solucion'>
              * La propuesta de solución / tu idea
              </label>
            <textarea
              className='form-control'
              required
              rows='7'
              max='5000'
              name='solucion'
              value={this.state['solucion']}
              onChange={this.handleInputChange}>
            </textarea>
          </div>


          <div className='form-group'>
            <label className='required' htmlFor='beneficios'>
                * Beneficios que brindará el proyecto a la facultad
            </label>
              <p className='help-text'>¿Como ayuda este proyecto a la facultad? ¿Quiénes se benefician?</p>
            <textarea
              className='form-control'
              required
              rows='7'
              max='5000'
              name='beneficios'
              value={this.state['beneficios']}
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
              <label htmlFor='adminCommentReference'>Link a la propuesta definitiva:</label>
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
              <div className="error-box mt-5">
             <ul>
                    {this.hasErrorsField('nombre') && <li className="error-li">El campo "Nombre y apellido" no puede quedar vacío</li> }
                    {this.hasErrorsField('documento') && <li className="error-li">El campo "DNI" no puede quedar vacío</li> }
                    {/* {this.hasErrorsField('genero') && <li className="error-li">El campo "Género" no puede quedar vacío</li> } */}
                    {this.hasErrorsField('email') && <li className="error-li">El campo "Email" no puede quedar vacío</li> }
                    {this.hasErrorsField('titulo') && <li className="error-li">El campo "Título" no puede quedar vacío</li>}
                    {this.hasErrorsField('problema') && <li className="error-li">El campo "Problema" no puede quedar vacío</li> }
                    {this.hasErrorsField('tag') && <li className="error-li">El campo "Tipo" no puede quedar vacío</li> }
                    {this.hasErrorsField('solucion') && <li className="error-li">El campo "Tu idea" no puede quedar vacío</li> }
                    {this.hasErrorsField('beneficios') && <li className="error-li">El campo "Beneficios" no puede quedar vacío</li>}
                    {this.hasErrorsField('facultad') && <li className="error-li">El campo "Facultad" no puede quedar vacío</li> }
                    {this.hasErrorsField('claustro') && <li className="error-li">El campo "Claustro" no puede quedar vacío</li>}
             </ul>
             </div>
          }
            <p className="more-info add-color">*La propuesta será revisada por el equipo de la Municipalidad y notificará su factibilidad a la brevedad. Si la propuesta es factible pasará a la etapa de votación.</p>
          <div className='submit-div'>
            { !this.hasErrors() &&
              <button type='submit' className='submit-btn'>
                {this.state.mode === 'new' ? 'Enviar idea' : 'Guardar idea'}
              </button>
            }
              {this.hasErrors() &&
                <button type='submit' className='submit-btn-disabled' disabled="true">
                  {this.state.mode === 'new' ? 'Enviar idea' : 'Guardar idea'}
                </button>
              }
            </div>
          </section>}

          
        </form>
      </div>
    )

    } return (
      <div className='form-propuesta'>
        <div className='propuesta-header'>
          <h1 className='text-center'>PRESUPUESTO PARTICIPATIVO UNMDP</h1>
          {/* <p>¡Acá vas a poder subir tu propuesta para el presupuesto participativo!</p> */}
          <p>¡Gracias a todos y todas por participar!</p>
        </div>
        {/* ALERT PARA FIN DE ETAPA */}
        <alert className='alert alert-info cronograma'>
          <Link style={{ display: 'inline' }} to='/s/acerca-de?scroll=cronograma'>
            La etapa de envío de propuestas ya ha sido cerrada. ¡Muchas gracias por participar!
          </Link>
        </alert>
     </div>
    )
  }
}

export default userConnector(FormularioPropuesta)
