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
  return returnText.length > 400 ? returnText.slice(0, 400) + '...' : returnText
}

export class VotoTopicCard extends Component {
  selectTopic = (e) => {
    e.preventDefault()
    console.log("hola")
  }
  render() {
    const { topic } = this.props

    return (
      <div className='ext-topic-card ideas-topic-card' onClick={this.selectTopic}>
        <div className={`idea-${topic && topic.attrs && topic.attrs.state}`}>
          <div className='topic-card-info'>
            <h1 className={`topic-card-title `}>
              {topic.mediaTitle}
            </h1>
            <p className='topic-card-description'>
              {createClauses(topic)}
            </p>
          </div>

        </div>
      </div>
    )
  }
}

export default VotoTopicCard
