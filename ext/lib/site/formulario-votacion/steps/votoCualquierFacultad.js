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
        facultades,
        activeFacultades,
        handleFilter,
        handleDefaultFilter,
        clearFilter,
        handleShowTopicDialog
    }) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>3. Elegí un proyecto de cualquier facultad</h1>
            <p>Si querés votar en blanco presioná "Siguiente" sin elegir ningún proyecto</p>
            <FilterProyectos
              tags={tags}
              activeTags={activeTags}
              facultades={facultades}
              activeFacultades={activeFacultades}
              handleFilter={handleFilter}
              handleDefaultFilter={handleDefaultFilter}
              clearFilter={clearFilter} 
              topics={topics}
              />            
        </div>
        <div className='wrapper'>
            {topics && topics.map((topic) => (
                <VotoTopicCard 
                    key={topic.id} 
                    topic={topic} 
                    handler={handler} 
                    selected={selected} 
                    setState={setState} 
                    handleShowTopicDialog={handleShowTopicDialog}
                />
            ))}
        </div>
    </div>
)