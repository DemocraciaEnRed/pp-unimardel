import React from 'react'
import config from 'lib/config'

export default function BannerForoVecinal (props) {
  return (
    <section className='container-fluid intro-mapa'>
        <div className="row">
          <div className="col-md-12">
            <div className="fondo-titulo">
              <h2>Zonas de MDQ</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <img src='/ext/lib/site/banner-mapa-vectores/vector-map.svg' alt="Mapa de zonas en vectores"/>
          </div>
        </div>  
        <div className="row">
          <div className="col-md-8">
            <p className="text-right">Puede ver el mapa en detalle <a href="https://www.google.com/maps/d/u/0/viewer?mid=1lCtk77BcCijc9i12q4Kg6RQTsejF1aJJ&ll=-37.97165492717816%2C-57.78389299999999&z=10" target="_blank">aqui</a></p>
          </div>
          <div className="col-md-4"></div>
        </div>                
    </section>
  )
}
