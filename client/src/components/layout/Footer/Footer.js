import React from 'react'
import playStore from '../../../images/playstore.png'
import AppStore from '../../../images/Appstore.png'
import "./Footer.css"
const Footer = () => {
    return (
        <footer id='footer'>

            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and Ios mobile Phone</p>
                <img src={playStore} alt="playStore" />
                <img src={AppStore} alt="appStore" />
            </div>

            <div className="midFooter">
                <h1>ECOMMERCE</h1>
                <p>High Quality is our first priority</p>

                <p>Copyrights 2021 &copy; MeShivMukesh</p>
            </div>

            <div className="rightFooter">
                <h4>Follow Us</h4>
                <a href="http://instagrame.com/meshivmukesh">Instagrame</a>
                <a href="http://youtube.com/meshivmukesh">Youtube</a>
                <a href="http://twitter.com/meshivmukesh">Twitter</a>
            </div>
        </footer>
    )
}

export default Footer
