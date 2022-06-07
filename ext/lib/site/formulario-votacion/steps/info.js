import React from 'react'

export default () => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>Presupuesto Participativo General Pueyrredon 2022</h1>
            <p>Pasos y reglas para la votación</p>
        </div>
        <div className='wrapper text-center'>
          <p>Tiene <b className='superbold'>2 votos disponibles.</b></p> 
          <p>El <b className='superbold'>primer voto es obligatorio</b> y se destina a <b className='superbold'>tu zona indicada al momento de registro</b></p>
          <p>(Los proyectos apareceran automaticamente ya definidos por tu zona)</p>
          <p>El <b className='superbold'>segundo voto es opcional</b> y se destina a votar un proyecto de <b className='superbold'>cualquier zona del municipio.</b></p>
        </div>
    </div>
)