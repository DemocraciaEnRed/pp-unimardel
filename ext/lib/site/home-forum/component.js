import React, { Component } from 'react'

import HomeCatalogo from '../home-catalogo/component'
import HomeAbout from '../home-about/component';


const HomeForum = (props) => {
  const { params: { forum } } = props;
  let years

  switch (forum) {
    case 'propuestas':
      years = ['2025']
      const propuestasAnio = [new Date().getFullYear()]
      return <HomeCatalogo {...props} years={propuestasAnio} archive={false} />
    case 'acerca-de':
      return <HomeAbout {...props} />
    case 'archivo':
      years = ['2024']
      return <HomeCatalogo {...props} years={years} state={['ganador']} archive={true} />
    default:
      // que nunca caiga en la vieja pantalla de proyectos
      //return <HomeProyectos {...props} />
      return <HomeCatalogo {...props} />
  }
}

export default HomeForum
