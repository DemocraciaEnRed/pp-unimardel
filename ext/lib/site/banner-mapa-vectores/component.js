import React from 'react'
import config from 'lib/config'

import VectorMap from './vectorMap'


export default function BannerForoVecinal (props) {
  return (
    <section className='container-fluid intro-mapa'>
        <div className="row">
          <div className="col-md-12">
            <div className="fondo-titulo">
              <h2>ZONAS ParticipaMGP PP</h2>
            </div>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-12">
            <div className='mapa-box'>
              <iframe className='mapa' src="https://www.google.com/maps/d/embed?mid=1Q1kDWfyz0PCdRx1OFlNoOA644HP9W2Bu" frameBorder="0" allowFullScreen></iframe>            
            </div>
          </div>
        </div>           */}
        <div className="row">
          <div className="col-md-12">
            <VectorMap 
              onClick={(e) => alert("que dice")}
            />
          </div>
        </div>  
        <div className="row">
          <div className="col-md-8">
            <p className="text-right">Puede ver el mapa en detalle <a href="https://www.google.com/maps/d/viewer?mid=1Q1kDWfyz0PCdRx1OFlNoOA644HP9W2Bu&ll=-37.97165492717815%2C-57.78389299999999&z=10" target="_blank">aquí</a></p>
          </div>
          <div className="col-md-4"></div>
        </div>                
    </section>
  )
}
