import React from 'react'
import { Link } from 'react-router'

const Footer = () => (
  <footer className='footer-static'>
    <div className='container'>
      <div className='contacto-detalles'>
        <h3>CONTACTO</h3>
        <p>
          <span>Subsecretaría de Modernización</span>
          <span>Av. Juan B. Justo 5665 Piso 1</span>
          <span>Mar Del Plata, Provincia de Buenos Aires</span>
          <span>Código postal: B7604AAG</span>
          <span><a tabIndex="8" href="mailto:articipaMGP@mardelplata.gob.ar">ParticipaMGP@mardelplata.gob.ar</a></span>
        </p>
      </div>
      <div className='social-icon'>
        <a className='social-facebook' tabIndex="9"  href='https://facebook.com/municipalidadmardelplata/ ' target="_blank"/>
        <a className='social-instagram' tabIndex="10"  href='https://instagram.com/munimardelplata/' target="_blank" />
        <a className='social-twitter' tabIndex="11"  href='https://twitter.com/munimardelplata/' target="_blank" />
        <a className='social-mail' tabIndex="12"  href='mailto:ParticipaMGP@mardelplata.gob.ar' target="_blank"/>
      </div>
      <div className='logos'>
        {/* <a href="https://democraciaenred.org/" rel="noopener noreferer" target="_blank">
          <div className='logo-der'>
            <img src="/ext/lib/site/footer/logo-der.png" alt="Logo democracia en red"/>
            <span>Desarrollado por<br /><b>Democracia en red</b></span>
          </div>
        </a> */}
        <a href=""></a>
        <div className='logo'>
          <a className='logo-mgp' href='https://www.mardelplata.gob.ar/' aria-name="Link a pagina mar del plata" rel="noopener noreferer" target="_blank" />
        </div>
      </div>
      <div className='terminos'>
        <Link to='/s/terminos-y-condiciones' tabIndex="13"> Términos y condiciones
        </Link>
        <a href="/reglamento" tabIndex="14" rel="noopener noreferer" target="_blank"> Reglamento
        </a>
      </div>
    </div>
  </footer>
)

export default Footer
