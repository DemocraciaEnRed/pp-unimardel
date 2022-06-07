import React from 'react'
import VotoTopicCard from './topic-card/component'


export default ({topics}) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>2. Elige un proyecto de tu zona</h1>
            <p>Temáticas de los proyectos</p>
        </div>
        <div className='wrapper text-center'>
            {topics && topics.map((topic) => (
                <VotoTopicCard key={topic.id} topic={topic} forum={{ title: topic.attrs.barrio }} />
            ))}
        </div>
    </div>
)