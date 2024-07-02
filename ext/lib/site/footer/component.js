import React, {Component} from 'react'
import { Link } from 'react-router'
import PopUp from '../Popup/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import textStore from 'lib/stores/text-store'


export default class Footer  extends Component {
  constructor (props) {
   super(props)
    this.state={
      forum:null,
      texts:{}
    }
 }

 componentDidMount(){
  Promise.all([forumStore.findOneByName('proyectos'),
                textStore.findAllDict()])
                .then((results) => {
                  const [forum, textsDict] = results
                  this.setState({forum,texts:textsDict})
                 })
 }
  render(){
    const {forum, texts} = this.state
    return(
  <footer className='footer-static'>
    {forum && <PopUp forum={forum} />}
    <div className='container'>
      <div className='contacto-detalles'>
        <h3>CONTACTO</h3>
        <p dangerouslySetInnerHTML={{__html: texts['footer-info']}}>
          
        </p>

      </div>
          <div className="mapa-box"><div><iframe className="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.7735132720068!2d-57.5734977849084!3d-38.00574297971802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584deb7308df243%3A0x73f08d2c6aeca400!2sUniversidad%20Nacional%20de%20Mar%20del%20Plata!5e0!3m2!1ses!2sar!4v1675882131071!5m2!1ses!2sar" frameBorder="0" allowFullScreen=""></iframe></div></div>
          {/*  <div className='social-icon'>
        
        <a aria-label='Ícono de instagram' className='social-instagram' tabIndex="103"  href='https://instagram.com/munimardelplata/' target="_blank" />
        <a aria-label='Ícono de twitter' className='social-twitter' tabIndex="104"  href='https://twitter.com/munimardelplata/' target="_blank" />
        <a aria-label='Ícono de mail' className='social-mail' tabIndex="105"  href='mailto:presupuestoparticipativo@mdp.edu.ar' target="_blank"/>
        <a aria-label='Ícono de whatsapp' className='social-whatsapp' tabIndex="106"  href='https://wa.link/69dr1s' target="_blank" />
      </div> */}
      <div className='logos'>
            <a href="https://democraciaenred.org/" rel="noopener noreferer" target="_blank">
          <div className='logo-der'>
                <img src="/ext/lib/site/footer/logo-der.png" alt="Logo democracia en red" />
          </div>
            </a>
            <a href="https://www.mdp.edu.ar/" rel="noopener noreferer" target="_blank">
              <div className='logos-wrapper'>
                <img className='logo-unmdp' src="/ext/lib/site/footer/logo-unmdp.png" alt="Logo universidad de Mar del Plata" />
                <div className='logo-secretaria'>
                  <img src="/ext/lib/site/footer/logo-secretaria-a.png" alt="Logo universidad de Mar del Plata" />
                  <img src="/ext/lib/site/footer/logo-secretaria-b.png" alt="Logo universidad de Mar del Plata" />
                </div>
              </div>
            </a>
        <div className='logo'>
          <a className='logo-mgp' tabIndex="107" href='https://www.mardelplata.gob.ar/' aria-label="Link a página de Mar del Plata" rel="noopener noreferer" target="_blank" />
        </div>
      </div>
      <div className='terminos'>
        <Link to='/s/terminos-y-condiciones' tabIndex="108"> Términos y condiciones
        </Link>
            <a href="https://drive.google.com/file/d/1I1D-a1HNfAQNSMejPKrUeUAzPeglnvLQ/view?usp=drive_link" tabIndex="109" rel="noopener noreferer" target="_blank"> Reglamento
        </a>
      </div>
    </div>
  </footer>

    )
  }
}
