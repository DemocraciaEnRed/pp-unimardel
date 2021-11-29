import React from 'react'
import config from 'lib/config'

export default function BannerForoVecinal (props) {
  return (
    <section className='container-fluid intro-mapa'>
        <div className="row">
          <div className="col-md-12">
            <div className="fondo-titulo">
              <h2> Zonas de MDQ</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className='mapa-box'>
              <iframe className='mapa' src="https://www.google.com/maps/d/embed?mid=1Q1kDWfyz0PCdRx1OFlNoOA644HP9W2Bu" frameBorder="0" allowFullScreen></iframe>            
            </div>
          </div>
        </div>          
        {/* <div className="row">
          <div className="col-md-12">
            <img src='/ext/lib/site/banner-mapa-vectores/vector-map.svg' alt="Mapa de zonas en vectores"/>
          </div>
        </div>   */}
        {/* <div className="row">
          <div className="col-md-8">
            <p className="text-right">Puede ver el mapa en detalle <a href="https://www.google.com/maps/d/viewer?mid=1Q1kDWfyz0PCdRx1OFlNoOA644HP9W2Bu&ll=-37.97165492717815%2C-57.78389299999999&z=10" target="_blank">aqui</a></p>
          </div>
          <div className="col-md-4"></div>
        </div>                 */}
    </section>
  )
}
