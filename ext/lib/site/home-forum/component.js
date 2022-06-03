import React from 'react'

import HomeCatalogo from '../home-catalogo/component'

const HomeForum = (props) => {
  const { params: { forum } } = props
  switch (forum) {
    case 'propuestas':
      return <HomeCatalogo {...props} />
    default:
      // que nunca caiga en la vieja pantalla de proyectos
      //return <HomeProyectos {...props} />
      return <HomeCatalogo {...props} />
  }
}

export default HomeForum
