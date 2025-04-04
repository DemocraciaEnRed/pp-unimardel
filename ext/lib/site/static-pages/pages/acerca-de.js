import React, { Component } from 'react'
import { Link } from 'react-router'
import Footer from 'ext/lib/site/footer/component'
import Jump from 'ext/lib/site/jump-button/component'
import Anchor from 'ext/lib/site/anchor'
// https://github.com/glennflanagan/react-responsive-accordion
import Accordion from 'react-responsive-accordion';

export default class Page extends Component {
  componentDidMount () {
    const u = new window.URLSearchParams(window.location.search)
    if (u.get('scroll') === 'cronograma') return Anchor.goTo('cronograma')
    this.goTop()
  }

  goTop () {
    window.scrollTo(0,0)
  }

  render () {
    return (
      <div>
        <section className="banner-static">
          <div className="banner"></div>
          <div className='contenedor'>
            <div className='fondo-titulo'>
              <h1>Presupuesto Participativo</h1>
            </div>
          </div>
        </section>
        <div id='container' className="">
          <div className='ext-acerca-de container'>
            <div className="filas">
              <div className="fila faq text-left">
                <p className='p-padding'>Accedé al <a target="_blank" href="https://democraciaenred.nyc3.digitaloceanspaces.com/projects/pp-unimardel/2025-unmdp-reglamento.pdf">reglamento general</a> de Participa UNMDP. En este espacio te dejamos algunas normas básicas para que conozcas el funcionamiento del Presupuesto Participativo.</p>

                <Accordion>
                  <div data-trigger="+ ¿QUÉ ES EL PRESUPUESTO PARTICIPATIVO DE UNIVERSIDAD NACIONAL DE MAR DEL PLATA?">
                    <p className='p-padding'>El Programa ParticipaUNMDP PP (Presupuesto Participativo) es un espacio donde vas a poder presentar las ideas que tu facultad necesita. Luego, a través del voto, los alumnos de la facultad van a poder decidir en qué utilizar parte del presupuesto del Municipio.</p>
                  </div>
                  <div data-trigger="+ ¿CÓMO SE DISTRIBUYE EL DINERO POR FACULTAD?">
                    <p className='p-padding'>
                    La partida presupuestaria anual asignada al Programa ParticipaUNMDP, definida anualmente por la Secretaría de Economía y Hacienda, respetando los límites expuestos en la O-25061, se distribuye en 11 facultades considerando equidad territorial, equidad distributiva y cumplimiento fiscal.
                    <br/>
                    Para ésto, se le asignará a cada facultad el monto que surja de las siguientes pautas:
                    <ul>
                      <li>25% del monto total del proyecto de ParticipaUNMDP será distribuido en partes iguales.</li>
                      <li>25% del monto total será dividido proporcionalmente a la población de cada facultad, según el último Censo Nacional de Población, Hogares y Viviendas (CNPHyV) disponible.</li>
                      <li>25% del monto total será dividido proporcionalmente a la cantidad de hogares afectados con Necesidades Básicas Insatisfechas (NBI) de cada facultad, según el último Censo Nacional de Población, Hogares y Viviendas (CNPHyV) disponible.</li>
                      <li>25% del monto total será dividido proporcionalmente según el cumplimiento fiscal de cada facultad en la Tasa de Servicios Urbanos (TSU), de acuerdo a listado provisto por la Agencia de Recaudación Municipal del año fiscal anterior.</li>
                    </ul>
                    </p>
                  </div>
                  <div data-trigger="+ ¿QUIÉN PUEDE PRESENTAR IDEAS?">
                    <p className='p-padding'>
                      Cualquier persona mayor de 16 años (cumplidos a la fecha de votación) con domicilio en su DNI en cualquiera de las facultades en las que se divide el Partido.
                    </p>
                  </div>
                  <div data-trigger="+ ¿CÓMO SE ELABORAN LAS IDEAS?">
                    <p className='p-padding'>
                    En una serie de reuniones informativas, los vecinos y los representantes de las entidades serán capacitados por funcionarios municipales y/o grupo de consejeros seleccionados en cada facultad con el fin de cargar las ideas en la plataforma digital PARTICIPA.MARDELPLATA.GOB.AR utilizando el formulario de presentación de ideas.
                    </p>
                  </div>

                  <div data-trigger="+ ¿CÓMO SE DECIDE QUÉ PROYECTOS VAN A VOTACIÓN?">
                    <p className="p-padding">
                      Para que una idea pueda convertirse en un proyecto votable, luego del trabajo conjunto con funcionarios y/o grupo de consejeros, se pasa a una etapa de análisis legal, técnico y presupuestario. En esta instancia se termina de definir la factibilidad del proyecto y los costos estimados del mismo.
                    </p>
                  </div>

                  <div data-trigger="+ ¿QUIÉN PUEDE VOTAR LOS PROYECTOS?">
                    <p className='p-padding'>
                      Cualquier persona mayor de 16 años (cumplidos a la fecha de votación) con domicilio en su DNI en cualquiera de las facultades en las que se divide el Partido puede votar los proyectos.
                    </p>
                  </div>
                  
                  <div data-trigger="+ ¿PUEDO VOTAR MÁS DE UNA VEZ?">
                    <p className="p-padding">
                      Se puede votar un sola vez, con la posibilidad de seleccionar 2 (dos)  proyectos, uno en la facultad asignada a tu domicilio o seleccionada en la plataforma y otro en cualquier facultad.
                    </p>
                  </div>

                  <div data-trigger="+ ¿CÓMO VOTAR?">
                    <p className="p-padding">
                      Para poder votar los proyectos, tenés que registrarte en plataforma online ParticipaUNMDP (participa.mardelplata.gob.ar) y ahí seleccionar tus preferidos.
                    </p>
                  </div>
                </Accordion>

              </div>
            </div>
          </div>
        </div>
        <Jump goTop={this.goTop} />
        <Footer />
      </div>
    )
  }
}
