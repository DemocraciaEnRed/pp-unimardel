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
        zonas,
        activeZonas,
        handleFilter,
        handleDefaultFilter,
        clearFilter        
    }) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>3. Elige un proyecto de cualquier zona</h1>
            <p>Si desea votar en blanco presione siguiente sin elegir ningun proyecto</p>
            <FilterProyectos
              tags={tags}
              activeTags={activeTags}
              zonas={zonas}
              activeZonas={activeZonas}
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