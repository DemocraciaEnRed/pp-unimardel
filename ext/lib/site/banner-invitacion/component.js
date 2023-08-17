import React from 'react'
import config from 'lib/config'
import {Link} from 'react-router'


export default (props) =>  {
    const {forum} = props
    return(
    <div className="banner-ideas">
        <img src={
            forum.config.votacion ? 
            "/ext/lib/site/banner-invitacion/icon-votar.svg" :
            "/ext/lib/site/banner-invitacion/icon-idea.svg"

        } alt="Ideas"/>
        <p>{
        forum.config.votacion ? 
        'Te invitamos a conocer los proyectos y a votar los que quieras que se lleven adelante' :
        forum.config.propuestasAbiertas ? 
        "Subí tu idea o mejorá con tus comentarios las de los vecinos.": 
        forum.config.preVotacion  ? 
        "La etapa de subida de ideas ya finalizó. Ingresá para ver el listado completo" :
        'La etapa de votación ya finalizó. Podrás acceder a ver los proyectos ganadores'
        }</p>
        
        <Link to={'/propuestas'} tabIndex="31" className="boton-foro" href="">
            {
                (forum.config.preVotacion || forum.config.votacion) ? "Catálogo de Proyectos" : "Accedé a las ideas"
            }
        </Link>
        {
            forum.config.votacion && <Link to={'/votacion'} tabIndex="32" className="boton-votacion" href="">Votá los proyectos</Link>
        }
        {
            forum.config.preVotacion && <Link tabIndex="33" className="boton-votacion" target="_blank" href="https://www.mardelplata.gob.ar/documentos/comunicacion/participamgpproyectosganadores.pdf">Votos por proyectos</Link>
        }        
        
    </div>
)
}