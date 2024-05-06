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
            <div className='header-banner'>
                <h4>{texts['home-banner-title']}</h4>
                <p>{texts['home-banner-subtitle']}</p>

            </div>
            <div className='actions' >
                {texts['home-banner-button1-text'] &&
                    <Link href={texts['home-banner-button1-link']} tabIndex="31" className="boton-foro">
                        {texts['home-banner-button1-text']}
                    </Link>}
                {texts['home-banner-button2-text'] &&
                    <Link href={texts['home-banner-button2-link']} tabIndex="32" className="boton-votacion">
                        {texts['home-banner-button2-text']}
                    </Link>}
            </div>
    </div>
)
}