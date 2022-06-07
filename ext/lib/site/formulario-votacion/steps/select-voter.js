import React from 'react'

export default ({zonas, setState}) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 className='text-center'>Presupuesto Participativo General Pueyrredon 2022</h1>
            <p>Gracias por participar de la votacion del presupuesto participativo 2022</p>
        </div>
        <div className='wrapper text-center'>
            <h5 className="superbold">Ingrese datos del usuario no registrado</h5>
            <div className='form-group'>
            <label className='required' htmlFor='dni'>
              DNI
            </label>
            <input
              className='form-control'
              required
              type='text'
              name='dni'
              placeholder="Ingrese su nombre de usuario / dni"
              onChange={setState}
              />
          </div>         
          <div className='form-group'>
            <label className='required' htmlFor='zona'>
              Zona de residencia
            </label>
            <select
              className='form-control'
              required
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