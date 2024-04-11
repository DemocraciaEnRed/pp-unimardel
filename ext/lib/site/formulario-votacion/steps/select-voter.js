import React from 'react'

export default ({facultades, setState}) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h1 tabIndex="0" className='text-center'>Votación del Presupuesto Participativo universidad de Mar del Plata 2024</h1>
        </div>
        <div className='wrapper text-center'>
            <p className="superbold">Ingresá los datos del votante</p>
            <div className='form-group'>
            <label className='required' htmlFor='dni'>
              DNI
            </label>
            <input
              className='form-control'
              type='text'
              name='dni'
              placeholder="Ingresá el DNI"
              onChange={setState}
              />
          </div>         
          <div className='form-group'>
            <label className='required' htmlFor='facultad'>
              Facultad de Residencia
            </label>
            <select
              className='form-control'
              name='facultad'
              onChange={setState}>
            <option value=''>Seleccioná una facultad</option>
            {facultades.length > 0 && facultades.sort(function(a, b) {
                const y = a.nombre.split("Facultad ")[1]
                const z = b.nombre.split("Facultad ")[1]
                return y-z;
                }).map(facultad =>
                <option key={facultad._id} value={facultad._id}>
                {facultad.nombre}
                </option>
            )}
            </select>
          </div>               
        </div>
    </div>
)