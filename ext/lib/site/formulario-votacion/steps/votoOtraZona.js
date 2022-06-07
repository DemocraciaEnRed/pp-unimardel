import React from 'react'
import VotoTopicCard from './topic-card/component'

export default ({topics}) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>3. Elige un proyecto de cualquier zona</h1>
            <p>Si desea votar en blanco presion siguiente sin elegir ningun proyecto</p>
        </div>
        <div className='wrapper text-center'>
            {topics && topics.map((topic) => (
                <p>{topic.mediaTitle}</p>
            ))}
        </div>
    </div>
)