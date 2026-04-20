import React, { Component } from 'react'

import HomeCatalogo from '../home-catalogo/component'
import HomeAbout from '../home-about/component';


const currentEdition = Number.parseInt(process.env.CURRENT_EDITION, 10) || new Date().getFullYear()
const archiveYears = [currentEdition - 3, currentEdition - 2, currentEdition - 1].map(String)


const HomeForum = (props) => {
  const { params: { forum } } = props;

  switch (forum) {
    case 'propuestas':
      const propuestasAnio = [currentEdition]
      return <HomeCatalogo {...props} years={propuestasAnio} archive={false} />
    case 'acerca-de':
      return <HomeAbout {...props} />
    case 'archivo':
      return <HomeCatalogo {...props} years={archiveYears} state={['ganador']} archive={true} />
    default:
      // que nunca caiga en la vieja pantalla de proyectos
      //return <HomeProyectos {...props} />
      return <HomeCatalogo {...props} />
  }
}

export default HomeForum
