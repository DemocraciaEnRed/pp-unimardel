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

// const PROPOSALS_FORUM_NAME = 'propuestas'

const descripciones = {
  'asfalto/mejora-asfaltica': "Cantidad de cuadras/Metros\nEs cordón cuneta: Si/No\nSolo cordón cuneta: Si/No",
  'luminarias': "Hay que renovar instalaciones?\nEs instalar nueva luminaria?\nQué cantidad?",
  'semáforos': "Cuánto semáforos?\nVehicular o peatonal?",
  'plazas-espacios-públicos': "De qué tipo? Plaza / Playon deportivo/ Skatepark\nRenovación, ampliación o nueva?\n Tipo de mejoras: veredas, iluminación, juegos, bancos",
  'equipamiento-plazas': "Qué elementos hay que mejorar o renovar? (Reparación, reposición y pintura de mobiliario urbano existente, Kit de juegos, Kit de juegos saludables, Cestos de basura, Banco de plaza de cemento)",
  'señalización-vertical/horizontal': "Qué tipo? (señalizar senda peatonal, incluir numero de vivienda/propiedad, pintar cordón de la calle)\nEs carteleria o sobre el piso/asfalto?",
  'cestos-de-basura': "Cuántos cestos querés aplicar?\nEn dónde querés que se distribuyan/apliquen?",
  'rampas': "Qué tamaño de rampa?\nDónde estaría ubicada?",
  'reductores-de-velocidad': "Dónde lo ubicamos?",
  'capacitaciones/actividades-deportivas': "Qué tipo de actividad?\nCuántas veces por semana?\nEn qué lugar lo harías?",
  'ciclovía/bicisenda': "Es renovación de bicisenda existente?\nQué tramo o recorrido sería?",
  'mejoras/equipamiento-entidades-de-bien-público': "Qué tipo de entidad?\nEs una mejora edilicia o compra de equipamiento?",
  'garitas-de-colectivo': "Dónde estaría ubicada?\nEs renovación o instalación nueva?",
  'limpieza': "Es un terreno baldío, mini basural, espacio público descuidado?",
  'red-wifi': "Dónde la ubicamos?",
  'cámaras-com': "Cuántas cámaras crees que hacen falta?\nEn qué zona especifica las ubicamos?",
}



class FormularioPropuesta extends Component {
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
      solucion: '',
      beneficios: '',
      ubicacion: '',
      barrio: '',
      telefono: '',
      requirementsAccepted: false,
      
      state: '',
      adminComment: '',
      adminCommentReference: '',
      
      availableTags: [],
      zonas: [],
      barrios: [],
      
      dialogZonaisOpen: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    
  }

  handleInputChange (evt) {
    evt.preventDefault()
    const { target: { value, name } } = evt
    this.setState({ [name]: value })
    if (name === "barrio") {
      const {zonas} = this.state
      const finalZona = zonas.find(zona => zona.barrios.includes(value))
      this.setState({ zona: finalZona.id })
    }
  }

  componentWillMount () {
    const isEdit = this.props.params.id ? true : false

    const promises = [
      // data del forum
      forumStore.findOneByName('proyectos'),
      tagStore.findAll(),
      zonaStore.findAll(),
    ]

    // si es edición traemos data del topic también
    if (isEdit)
      promises.push(topicStore.findOne(this.props.params.id))

    Promise.all(promises).then(results => {
      // topic queda en undefined si no estamos en edit
      const [ forum, tags, zonas, topic] = results
      let barrios = []
      zonas.forEach(zona => zona.barrios.forEach(barrio => barrios.push(barrio)))

      let newState = {
        forum,
        availableTags: tags,
        zonas,
        barrios: barrios,
        mode: isEdit ? 'edit' : 'new'
      }

      if (isEdit)
        Object.assign(newState, {
          titulo: topic.mediaTitle,
          documento: topic.attrs.documento,
          // genero: topic.attrs.genero,
          zona: topic.attrs.zona,
          problema: topic.attrs.problema,
          solucion: topic.attrs.solucion,
          beneficios: topic.attrs.beneficios,
          // los tags se guardan por nombre (¿por qué?) así que buscamos su respectivo objeto
          tags: tags.filter(t => topic.tags.includes(t.name)),
          state: topic.attrs.state,
          adminComment: topic.attrs['admin-comment'],
          adminCommentReference: topic.attrs['admin-comment-reference'],
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
      'attrs.solucion': this.state.solucion,
      'attrs.beneficios': this.state.beneficios,
      zona: this.state.zona,
      tags: this.state.tags.map(tag => tag.name)
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
    if (this.state.solucion === '') return true
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
      browserHistory.push('/signin?ref=/formulario-idea')
    }
  }

  render () {

    const { forum, zonas, barrios, requirementsAccepted } = this.state

    if (!forum) return null
    if(config.propuestasAbiertas || (this.state.forum.privileges && this.state.forum.privileges.canChangeTopics)) {
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
              <li className='bold'>Serán factibles las propuestas de obras o equipamiento para entidades sin fines de lucro (sociedades de fomento, centros de jubilados, asociaciones civiles, etc.) para espacios públicos y para escuelas de gestión pública provincial.</li>
              <li>Serán factibles campañas o talleres sobre un tema específico cuya ejecución sólo sea durante el 2024.</li>
              <li>No serán factibles las propuestas que impliquen un gasto corriente (recursos humanos que incrementen la planta municipal).</li>
              <li>Cada propuesta se debe presentar para un solo barrio. (No se puede presentar una propuesta para todo el Municipio)</li>
              <li>El presupuesto máximo de la propuesta no puede superar los $ 10.000.000.</li>
            </ul>
              
          </div>

          <div className="row ideas-no-factibles">
            <div className="col-md-4">
              <div className="idea-no-factible">
                <img src="/ext/lib/site/formulario-propuesta/no-factible.png" alt="Ícono propuesta no factible"/>
                <p>“Asfaltar todas las calles MGP”</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="idea-no-factible">
                <img src="/ext/lib/site/formulario-propuesta/no-factible.png" alt="Ícono propuesta no factible"/>
                <p>“Dictar clases de xxxx los sabados en la rambla”</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="idea-no-factible">
                <img src="/ext/lib/site/formulario-propuesta/no-factible.png" alt="Ícono propuesta no factible"/>
                <p>“Mas personal en los centros municipales”</p>
              </div>
            </div>
          </div>
            
          <div className="row ideas-factibles">
            <div className="col-md-4">
              <div className="idea-factible">
                <img src="/ext/lib/site/formulario-propuesta/factible.png" alt="Ícono propuesta no factible"/>
                <p>“Poner juego en la Plaza zxy”</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="idea-factible">
                <img src="/ext/lib/site/formulario-propuesta/factible.png" alt="Ícono propuesta no factible"/>
                <p>“Camaras de seguridad en xxx”</p>
              </div>
            </div>
            <div className="col-md-4">
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
          
          <div className="bar-section acerca-requisitos mt-6">
            <p className='section-title'>Contanos sobre tu idea</p>
          </div>


          <div className='form-group mt-5'>
            <label className='required' htmlFor='titulo'>
              * Título de la idea
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
          <div className='tags-autocomplete'>
            <label className='required'>
              * Temas
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
            <label className='required' htmlFor='solucion'>
              * La propuesta de solución / tu idea
            </label>
            {this.state.tags.length > 0 && descripciones[this.state.tags[0].hash].split(/\n/).map((p, i)=> <p className='help-text'>{p}</p>)}
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
              Beneficios que brindará el proyecto al barrio
            </label>
            <p className='help-text'>¿Como ayuda este proyecto al barrio? ¿Quiénes se benefician?</p>
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

          <div className='form-group'>
            <label className='required' htmlFor='telefono'>
              Teléfono Celular
            </label>
            <p className="help-text">Colocá tu número de teléfono para poder contactarte</p>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='telefono'
              value={this.state['telefono']}
              onChange={this.handleInputChange} />
          </div>          

          <div className="parte-ubicacion mt-5">
            <p className='section-title'>Ubicación</p>
          </div>
          <hr />


          <div className='form-group'>
            <label className='required' htmlFor='zona'>
              ¿En qué zona se desarrollará la idea?
            </label>
            <p className='help-text'>* Recorda que las ideas deben pertenecer o ejecutarse en una zona especifica, no aplican ideas para varias zonas, ni para todo MGP</p>
            <select
              className='form-control'
              required
              name='zona'
              value={this.state['zona']}
              onChange={this.handleInputChange}>
              <option value=''>Seleccione una zona</option>
              {zonas.length > 0 && zonas.map(zona =>
                <option key={zona._id} value={zona._id}>
                  {zona.nombre}
                </option>
              )}
            </select>
            <span onClick={() => this.setState({dialogZonaisOpen: !this.state.dialogZonaisOpen})} className='help-text buscar-zona mt-2'>No sé cual es mi zona</span>
          </div>

          {this.state.dialogZonaisOpen && (
              <dialog
                  open
              >
                  <span onClick={() => this.setState({dialogZonaisOpen: !this.state.dialogZonaisOpen})}>&times;</span>
                  <h2>Buscador de zona</h2>

                  <div className='form-group'>
                    <label htmlFor='zona'>
                      ¿Cual es el barrio?
                    </label>
                    <select
                      className='form-control'
                      name='barrio'
                      value={this.state['barrio']}
                      onChange={this.handleInputChange}>
                      <option value=''>Seleccione un barrio</option>
                      {barrios.length > 0 && barrios.map((barrio, index) =>
                        <option key={index} value={barrio}>
                          {barrio}
                        </option>
                      )}
                    </select>
                  </div>


                  <div className='form-group'>
                    <label htmlFor='zona'>
                      Zona correspondiente
                    </label>
                    <select
                      className='form-control'
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

                  <p className='text-center mt-3'>ó explora el <a href="">mapa de zonas y barrios</a></p>

              </dialog>
              )}
                    


          <div className='form-group'>
            <label htmlFor='ubicacion'>
              ¿Cuál es la dirección (calle y altura)?
            </label>
            <input
              className='form-control'
              type='text'
              max='128'
              name='ubicacion'
              value={this.state['ubicacion']}
              onChange={this.handleInputChange} />
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
             <div className="error-box mt-6">
             <ul>
                    {this.hasErrorsField('nombre') && <li className="error-li">El campo "Nombre y apellido" no puede quedar vacío</li> }
                    {this.hasErrorsField('documento') && <li className="error-li">El campo "DNI" no puede quedar vacío</li> }
                    {/* {this.hasErrorsField('genero') && <li className="error-li">El campo "Género" no puede quedar vacío</li> } */}
                    {this.hasErrorsField('email') && <li className="error-li">El campo "Email" no puede quedar vacío</li> }
                    {this.hasErrorsField('titulo') && <li className="error-li">El campo "Título" no puede quedar vacío</li> }
                    {this.hasErrorsField('zona') && <li className="error-li">El campo "Zona" no puede quedar vacío</li> }
                    {this.hasErrorsField('tags') && <li className="error-li">El campo "Temas" no puede quedar vacío</li> }
                    {this.hasErrorsField('problema') && <li className="error-li">El campo "Problema" no puede quedar vacío</li> }
                    {this.hasErrorsField('solucion') && <li className="error-li">El campo "Tu idea" no puede quedar vacío</li> }
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
          </section>}

          
        </form>
      </div>
    )

    } return (
      <div className='form-propuesta'>
        <div className='propuesta-header'>
          <h1 className='text-center'>PRESUPUESTO PARTICIPATIVO MGP</h1>
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
