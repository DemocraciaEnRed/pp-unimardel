import React from 'react'
import VotoTopicCard from './topic-card/component'

export default ({topics, handler, selected, setState}) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>3. Elige un proyecto de cualquier zona</h1>
            <p>Si desea votar en blanco presion siguiente sin elegir ningun proyecto</p>
        </div>
        <div className='wrapper'>
            {topics && topics.map((topic) => (
                <VotoTopicCard 
                    key={topic.id} 
                    topic={topic} 
                    forum={{ title: topic.attrs.barrio }} 
                    handler={handler} 
                    selected={selected} 
                    setState={setState} 
                />
            ))}
        </div>
    </div>
)