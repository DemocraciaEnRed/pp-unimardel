import React from 'react'

export default ({dni, hasVoted}) => (
    <div className='form-votacion'>
        {hasVoted === 'yes' ? 
            (<div className='votacion-header'>
                <h1 className='text-center'>
                    El dni {dni} ya emitió su voto!
                </h1>
                <p>No se puede votar 2 veces</p>
            </div>) :
            (<div className='votacion-header'>
                <h1 className='text-center'>
                ¡Muchas gracias por tu voto!
                </h1>
                <p>Hemos recibido tus votos correctamente</p>
            </div>)
        }
        <div className='wrapper text-center'>
            Te agradecemos nuevamente por haber participado del primer Presupuesto participativo de General Pueyrredon
        </div>
    </div>
)