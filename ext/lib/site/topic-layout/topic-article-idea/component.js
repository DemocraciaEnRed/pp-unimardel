import React, { Component } from 'react'
import bus from 'bus'
import t from 't-component'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Header from './header/component'
import Social from './social/component'
import Cause from './cause/component'
import Comments from './comments/component'
import { Link } from 'react-router'
import VotarButton from 'ext/lib/site/home-catalogo/topic-card/votar-button/component'
import VerTodosButton from 'ext/lib/site/home-catalogo/topic-card/ver-todos-button/component'
import config from 'lib/config'
import Collapsible from 'react-collapsible'

class TopicArticle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSidebar: false
    }
  }

  componentWillMount () {
    bus.on('sidebar:show', this.toggleSidebar)
  }

  componentDidUpdate () {
    document.body.scrollTop = 0
  }

  componentWillUnmount () {
    bus.off('sidebar:show', this.toggleSidebar)
  }

  toggleSidebar = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  handleCreateTopic = () => {
    window.location = urlBuilder.for('admin.topics.create', {
      forum: this.props.forum.name
    })
  }

  handleBarrio = (barrio) => {
    const barrios = {
    }
    let barrioName = ''
    Object.keys(barrios).find((key) => {
      if (barrio === key) {
        barrioName = barrios[key]
      }
    })
    return barrioName
  }

  getEstado (name) {
    switch (name) {
      case 'pendiente':
        return 'pendiente'
        break
      case 'no-factible':
        return 'no factible'
        break
      case 'integrado':
        return 'integrada'
        break
      default:
        return 'factible'
        break
    }
  }

  twitText = () => {
    return encodeURIComponent('Sumate a pensar la Ciudad que queremos. ')
  }

  render () {
    const {
      topic,
      forum,
      user,
      onVote
    } = this.props

    const userAttrs = user.state.fulfilled && (user.state.value || {})
    const canCreateTopics = userAttrs.privileges &&
      userAttrs.privileges.canManage &&
      forum &&
      forum.privileges &&
      forum.privileges.canChangeTopics
    const isProyecto = topic && topic.attrs && topic.attrs.state == 'factible'
    const ideasIntegradas = topic && topic.integradas
    const isIntegrada = topic && topic.attrs && topic.attrs.state === 'integrado'

    const referenciaIntegradoraUrl = topic && topic.attrs && topic.attrs['admin-comment-referencia'] && window.location.origin + '/propuestas/topic/' + topic.attrs['admin-comment-referencia']

    if (!topic) {
      return (
        <div className='no-topics'>
          <p>{t('homepage.no-topics')}</p>
          {
            canCreateTopics && (
              <button
                className='btn btn-primary'
                onClick={this.handleCreateTopic} >
                {t('homepage.create-debate')}
              </button>
            )
          }
        </div>
      )
    }

    const socialLinksUrl = window.location.origin + topic.url
    const twitterText = this.twitText()

    const editUrl = userAttrs.staff ?
      urlBuilder.for('admin.topics.id', {forum: forum.name, id: topic.id})
    :
      `/formulario-idea/${topic.id}#acerca-propuesta`
    ;

    const buttons = <div className='topic-actions topic-article-content'>
    { !isProyecto && <Cause
      topic={topic}
      canVoteAndComment={forum.privileges.canVoteAndComment} /> }
    {/* { isProyecto &&
      <VotarButton topic={topic} onVote={onVote} />
    } */}
    &nbsp;
    <VerTodosButton />
  </div>

    return (
      <div className='topic-article-wrapper'>
        {
          this.state.showSidebar &&
            <div onClick={hideSidebar} className='topic-overlay' />
        }
        
        <Header
          closingAt={topic.closingAt}
          closed={topic.closed}
          author={null}
          authorUrl={null}
          tags={topic.tags}
          forumName={forum.name}
          mediaTitle={topic.mediaTitle}
          numero={topic.attrs && topic.attrs.numero} />
        

        <div className='topic-article-content entry-content skeleton-propuesta'>

        {isProyecto && topic.attrs['proyecto-titulo']
        && <div className='topic-article-nombre'>Proyecto: {topic.attrs['proyecto-titulo']}</div>}
        <div className='topic-article-nombre'>Autor/es/as: {topic.owner.firstName}</div>
        <div className='topic-article-zona'>{topic.zona.nombre}</div>
        
        {topic.attrs.state && 
        <div className='topic-article-nombre'>Estado: {topic.attrs.state}</div>}        
        <div className='topic-article-zona superbold'>Presupuesto: ${topic.attrs['presupuesto-total'].toLocaleString()}</div>

         <div className='topic-article-status-container'>
          {
            (forum.privileges && forum.privileges.canChangeTopics)
              ? (
                <div className='topic-article-content topic-admin-actions'>
                  <Link href={editUrl}>
                    <a className='btn btn-default'>
                      <i className='icon-pencil' />
                      &nbsp;
                      Editar proyecto
                    </a>
                  </Link>
                </div>
              )
              : (topic.privileges && topic.privileges.canEdit) &&

                (
                  <div className='topic-article-content topic-admin-actions'>
                    <a
                      href={editUrl}
                      className='btn btn-default'>
                      <i className='icon-pencil' />
                        &nbsp;
                      Editar proyecto
                    </a>
                  </div>
                )

          }
        </div>
{/* 
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
          { isProyecto && <div className='card-presupuesto'>
            <h3>
              Presupuesto asignado
            </h3>
            <span>${topic.attrs['presupuesto-total'].toLocaleString()}</span>
          </div> }
          </div>
          <div className="col-md-4"></div>
        </div> */}

        

          {topic.attrs['proyecto-contenido'] &&
            <div
              className='topic-article-proyecto superbold'
              dangerouslySetInnerHTML={{
                __html: topic.attrs['proyecto-contenido'].replace(/https?:\/\/[a-zA-Z0-9./]+/g, '<a href="$&" rel="noopener noreferer" target="_blank">$&</a>')
              }}>
            </div>
          }        
          
        </div>

        {isProyecto && buttons}
        
        
        <div className="seccion-idea">
          <div>
            <Collapsible 
              open={true} 
              triggerClassName='topic-article-idea' 
              triggerOpenedClassName='topic-article-idea' 
              trigger={`Idea Original`}>
              {topic.attrs['problema'].replace(/https?:\/\/[a-zA-Z0-9./]+/g)}                

              {isIntegrada && referenciaIntegradoraUrl && 
                <div className='topic-article-integrado'>
                  <u className='titulo'>Podés ver el proyecto final integrador</u>
                  <Link to={referenciaIntegradoraUrl} target="_blank">
                  <a className='btn link'>aquí</a>  
                  </Link>
                
                </div>
              }
              {isProyecto && ideasIntegradas.length > 0 && 
                <div className='topic-article-integrado'>
                  <u className='titulo'>Ideas integradas</u> <br />
                  {ideasIntegradas.map((idea) => <Link to={idea.id} target="_blank">
                    <a className='btn link'>{idea.mediaTitle}</a>  
                  </Link>
                  )}
                </div>
              }                            
            </Collapsible>

            {!isProyecto && buttons}

            {
              topic.attrs['admin-comment'] &&
              <Collapsible 
                open={true} 
                triggerClassName='topic-article-comentario' 
                triggerOpenedClassName='topic-article-comentario' 
                trigger={`Comentarios del moderador`}>
                {topic.attrs['admin-comment'].replace(/https?:\/\/[a-zA-Z0-9./]+/g)}                
                <p className='font-weight-bold'>Equipo de Coordinación y Gestión PPMGP</p>
              </Collapsible>            
            }

          </div>

        </div>

        <Social
          topic={topic}
          twitterText={twitterText}
          socialLinksUrl={socialLinksUrl} />
        <div className='topic-tags topic-article-content'>
          {
            this.props.topic.tags && this.props.topic.tags.map((tag, i) => <span className='topic-article-tag' key={i}>{ tag } </span>)
          }
        </div>

        { (topic.privileges && !topic.privileges.canEdit && user.state.value && topic.owner.id === user.state.value.id) &&
            (
              <p className='alert alert-info alert-propuesta'>
                El estado de ésta propuesta fue cambiado a {this.getEstado(topic.attrs.state)}, por lo tanto ya no puede ser editada por su autor/a.
              </p>
            )
        }

        {
          !user.state.pending && !isProyecto && <Comments forum={forum} topic={topic} />
        }
      </div>
    )
  }
}

export default userConnector(TopicArticle)

function hideSidebar () {
  bus.emit('sidebar:show', false)
}
