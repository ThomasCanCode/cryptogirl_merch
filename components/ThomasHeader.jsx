
import Menu from "../components/menu"
import Socials from "../components/socials"
import Image from 'next/image'
import logo from '/static/images/logo.png'
import styles from '../styles/Home.module.css'

export function toggleBurger(){
    document.getElementById('burgerContainer').classList.toggle('change') 
    document.getElementById('mobile_menu').classList.toggle('change') 
  }
  
  export function BurgerButton(){
    return (
      <div id='burgerContainer' className={styles.burgerContainer+" burger_opener"}  onClick={(e) => toggleBurger()}><div></div><div></div><div></div></div>
    )
  }
  
  export default function ThomasHeader(){
    return (
        <>
            <header className={styles.header}>
              <div className={styles.header_logo}>
                  <a className={styles.animated_anchor} href='https://cryptogirlnft.io/'><Image alt="Logo" src={logo} priority="true" /></a>
              </div>
              <div>
                  <Menu/>
              </div>
              <div>
                  <Socials/>
                  <BurgerButton/>
              </div>
            </header>
        </>
    )
}