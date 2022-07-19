import React from 'react'

export default () => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1>Presupuesto Participativo General Pueyrredón 2022</h1>
            <p>Pasos y reglas para la votación</p>
        </div>
        <div className='wrapper'>
          <li>Tiene <b className='superbold'>2 votos disponibles.</b></li> 
          <li>El <b className='superbold'>primer voto es obligatorio</b> y se destina a <b className='superbold'>tu zona indicada al momento de registro</b></li>
          <li>(Los proyectos aparecerán automáticamente ya definidos por tu zona)</li>
          <li>El <b className='superbold'>segundo voto es opcional</b> y se destina a votar un proyecto de <b className='superbold'>cualquier zona del municipio.</b></li>
        </div>
    </div>
)