import React from 'react'
import VotoTopicCard from './topic-card/component'
import FilterProyectos from './filter-proyectos/component'

export default ({
        topics, 
        handler, 
        selected, 
        setState,
        // Filters
        tags,
        activeTags,
        handleFilter,
        handleDefaultFilter,
        clearFilter
    }) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>2. Elige un proyecto de tu zona</h1>
            <FilterProyectos
              tags={tags}
              activeTags={activeTags}
              handleFilter={handleFilter}
              handleDefaultFilter={handleDefaultFilter}
              clearFilter={clearFilter} />

        </div>
        <div className='wrapper'>
            {topics && topics.map((topic) => (
                <VotoTopicCard 
                    key={topic.id} 
                    topic={topic} 
                    handler={handler} 
                    selected={selected} 
                    setState={setState} 
                />
            ))}
        </div>
    </div>
)