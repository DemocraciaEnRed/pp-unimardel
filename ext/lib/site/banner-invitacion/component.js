import React from 'react'
import config from 'lib/config'
import {Link} from 'react-router'


export default () =>  (
    <div className="banner-ideas">
        <img src={
            config.votacionAbierta ? 
            "/ext/lib/site/banner-invitacion/icon-votar.svg" :
            "/ext/lib/site/banner-invitacion/icon-idea.svg"

        } alt="Ideas"/>
        <p>{
        config.votacionAbierta ? 
        'Te invitamos a conocer los proyectos y a votar los que quieras que se lleven adelante' :
        config.propuestasAbiertas ? 
        "Subí tu idea o mejorá con tus comentarios las de los vecinos.": 
        config.propuestasVisibles ? 
        "La etapa de subida de ideas ya finalizó. Ingresá para ver el listado completo" :
        'La etapa de votación ya finalizó. Proximamente se publicarán los resultados con los proyectos ganadores'
        }</p>
        
        <Link to={'/propuestas'} tabIndex="31" className="boton-foro" href="">
            {
                config.votacionAbierta ? "Catálogo de Proyectos" : "Accedé a las ideas"
            }
        </Link>
        {
            config.votacionAbierta && <Link to={'/votacion'} tabIndex="32" className="boton-votacion" href="">Votá los proyectos</Link>
        }
        
    </div>
)