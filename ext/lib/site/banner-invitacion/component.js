import React from 'react'
import config from 'lib/config'
import {Link} from 'react-router'


export default (props) =>  {
    const {texts} = props
    return(
    <div className="banner-ideas">
        {texts['home-banner-image'] && 
        <img src={texts['home-banner-image']} alt="Ideas"/>
        }
        <p>{texts['home-banner-title']}</p>
        
        {texts['home-banner-button1-text'] && <Link to={texts['home-banner-button1-link']} tabIndex="31" className="boton-foro" href="">
            {texts['home-banner-button1-text']}
        </Link>}
        {texts['home-banner-button2-text'] && <Link to={texts['home-banner-button2-link']}  tabIndex="32" className="boton-votacion" target="_blank">{texts['home-banner-button2-text']}</Link>} 
        
        
    </div>
)
}