import React from 'react'

export default ({zonas, setState}) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 tabIndex="0" className='text-center'>Votación del Presupuesto Participativo General Pueyrredon 2022</h1>
            <p>Gracias por participar de la votacion del presupuesto participativo 2022</p>
        </div>
        <div className='wrapper text-center'>
            <p className="superbold">Ingrese datos del usuario no registrado</p>
            <div className='form-group'>
            <label className='required' htmlFor='dni'>
              DNI
            </label>
            <input
              className='form-control'
              type='text'
              name='dni'
              placeholder="Ingrese su nombre de usuario / dni"
              onChange={setState}
              />
          </div>         
          <div className='form-group'>
            <label className='required' htmlFor='zona'>
              Zona de Residencia
            </label>
            <select
              className='form-control'
              name='zona'
              onChange={setState}>
            <option value=''>Seleccioná una zona</option>
            {zonas.length > 0 && zonas.sort(function(a, b) {
                const y = a.nombre.split("Zona ")[1]
                const z = b.nombre.split("Zona ")[1]
                return y-z;
                }).map(zona =>
                <option key={zona._id} value={zona._id}>
                {zona.nombre}
                </option>
            )}
            </select>
          </div>               
        </div>
    </div>
)