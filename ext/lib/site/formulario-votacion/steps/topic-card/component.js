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


    return (
      <div className={`voto-topic-card ${topic.id === selected && 'active'}`}>
        <div className="row">
          <div className="col-md-8">
            <div className='voto-topic-card-info'>
              <h1 className='voto-topic-card-title'>
                {topic.mediaTitle.length > 70 ? topic.mediaTitle.slice(0,70) + "..." : topic.mediaTitle}
              </h1>
              {topic.attrs && <p className='voto-topic-card-description'>
                {createClauses(topic)}
              </p>}

            </div>



            <div className='voto-topic-card-footer'>
              <div className='voto-topic-card-tags'>
                { topic.zona && <span
                  className='voto-tag-wrapper tag-zona' >
                  {capitalizeFirstLetter(topic.zona.nombre)}
                </span>
                }                
                { topic.tags && topic.tags.length > 0 && topic.tags.slice(0, 12).map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className='voto-tag-wrapper' >
                    {capitalizeFirstLetter(tag)}
                  </span>   
                ))}
              </div>
            </div>





          </div>
          {topic.attrs && topic.attrs['presupuesto-total'] && <div className="col-md-2">
            <div className='voto-topic-card-info'>
                <h1 className='voto-topic-card-title'>
                  Presupuesto
                </h1>
                <p className='voto-topic-card-presupuesto'>
                  ${topic.attrs['presupuesto-total'].toLocaleString()}
                </p>
              </div>
          </div>}
          {handler && setState && <div className="col-md-2">
            <div className="voto-topic-card-checkbox">
              <input type="checkbox" name={handler} value={topic.id} onChange={setState} checked={topic.id === selected && true} className='select-topic' />
            </div>
          </div>}
          

        </div>


      </div>
    )
  }
}

export default VotoTopicCard
