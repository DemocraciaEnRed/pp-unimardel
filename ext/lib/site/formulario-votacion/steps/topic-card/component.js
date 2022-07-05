import React, { Component } from 'react'


function createClauses({ attrs, clauses }) {
  let div = document.createElement('div')
  let content
  if (!attrs) {
    content = clauses
      .sort(function (a, b) {
        return a.position > b.position ? 1 : -1
      })
      .map(function (clause) {
        return clause.markup
      })
      .join('')
  } else {
    const { problema } = attrs
    content = `${problema}`
  }
  div.innerHTML = content
  let returnText = div.textContent.replace(/\r?\n|\r/g, '')
  return returnText.length > 200 ? returnText.slice(0, 200) + '...' : returnText
}

export class VotoTopicCard extends Component {

  render() {
    const { topic, handler, selected, setState } = this.props

    function capitalizeFirstLetter(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    if (window.matchMedia('(max-width: 768px)').matches) {
      return (
        <div className={`voto-topic-card ${topic.id === selected ? 'active' : ""}`}>
          <div className="row">
            <div className="col-xs-9">
              <div className="voto-topic-card-info">
                <h1>
                  {topic.mediaTitle.length > 70 ? topic.mediaTitle.slice(0,50) + "..." : topic.mediaTitle}
                </h1>
                {topic.attrs && <p>{createClauses(topic)}</p>}
                <div className='voto-topic-card-tags'>
                  {topic.zona && <span className='voto-tag-wrapper tag-zona' >{capitalizeFirstLetter(topic.zona.nombre)}</span>}                
                  {topic.attrs && topic.attrs['presupuesto-total'] && <span className='voto-tag-wrapper tag-presupuesto'>Presupuesto: ${topic.attrs['presupuesto-total'].toLocaleString()}</span>}
                  {topic.tag && <span className='voto-tag-wrapper'>{capitalizeFirstLetter(topic.tag.name)}</span>}
                </div>                
              </div>
            </div>
            {handler && setState && <div className="col-xs-3">
              <div className="voto-topic-card-checkbox">
                <input type="checkbox" name={handler} id={topic.id} value={topic.id} onChange={setState} checked={topic.id === selected && true} className='select-topic' />
              </div>
            </div>}
          </div>
        </div>
      )
    } else {
      return (
        <div className={`voto-topic-card ${topic.id === selected ? 'active' : ""}`}>
          <div className="row">
            <div className="col-md-8">
              <div className="voto-topic-card-info">
                <h1>
                  {topic.mediaTitle.length > 70 ? topic.mediaTitle.slice(0,50) + "..." : topic.mediaTitle}
                </h1>
                {topic.attrs && <p>{createClauses(topic)}</p>}
                <div className='voto-topic-card-tags'>
                  {topic.zona && <span className='voto-tag-wrapper tag-zona' >{capitalizeFirstLetter(topic.zona.nombre)}</span>}                
                  {topic.tag && <span className='voto-tag-wrapper' >{capitalizeFirstLetter(topic.tag.name)}</span>}
                </div>                
              </div>
            </div>
            {topic.attrs && topic.attrs['presupuesto-total'] && <div className="col-md-2 text-center">
              <div className='voto-topic-card-presupuesto'>
                <h1>Presupuesto</h1>
                <p className='superbold'>${topic.attrs['presupuesto-total'].toLocaleString()}</p>
              </div>
            </div>}
            {handler && setState && <div className="col-md-2">
              <div className="voto-topic-card-checkbox">
                <input type="checkbox" name={handler} id={topic.id} value={topic.id} onChange={setState} checked={topic.id === selected && true} className='select-topic' />
              </div>
            </div>}
          </div>
        </div>
      )
    }
  }
}

export default VotoTopicCard
