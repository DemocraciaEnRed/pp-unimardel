import React from 'react'

export default ({changeStep}) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h5>Votación del</h5>
            <h1 className='text-center'>Presupuesto Participativo General Pueyrredón 2022</h1>
            <p>Gracias por participar de la votación del presupuesto participativo 2022</p>
        </div>
        <div className='wrapper text-center'>
            <button onClick={changeStep} className='boton-comenzar'>Comenzar</button>
            <p>
                Si aun no has visto los proyectos a votar <a href="/propuestas" target="_blank">podés verlos en mas detalle aquí</a>.
            </p>
        </div>
    </div>
)