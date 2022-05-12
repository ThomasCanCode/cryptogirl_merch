
import footer_bg from '/static/images/footer_bg.jpg'
import styles from '../styles/Home.module.css'
import logo from '/static/images/logo.png'
import Image from 'next/image'
import Menu from "../components/menu"
import Socials from "../components/socials"


          
export default function footer() {
  return (
    <footer className={styles.footer}>
        <Image alt='' src={footer_bg} />
        <div className={styles.footer_overlay}>
        <a className={styles.animated_anchor} href='https://cryptogirlnft.io/'><Image alt="Logo" src={logo} priority="true" /></a>
        <Menu/>
        <Socials/>
        <p className='pragmatica'>All the information on this website - www.cryptogirlnft.io - is published in good faith and for general information purpose only. Cryptogirl Nft does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (Cryptogirl Nft ), is strictly at your own risk. Cryptogirl Nft will not be liable for any losses and/or damages in connection with the use of our website.</p>
        </div>
    </footer>
  );
}
