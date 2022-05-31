
import styles from '../styles/Home.module.css'
import Link from 'next/link';
          
export default function Menu(){
  return (
    <ul>
      <li><a className={styles.animated_anchor} href="https://cryptogirlnft.io/our-team">TEAM</a></li>
      <li><a className={styles.animated_anchor} href="https://cryptogirlnft.io/disclaimer">DISCLAIMER</a></li>
      <li><a className={styles.animated_anchor} href="https://cryptogirlnft.io/contact-us">CONTACT</a></li>
      <li><Link href="/" passHref><a className={styles.animated_anchor}>SHOP</a></Link></li>
      <li><Link href="/points" passHref><a className={styles.animated_anchor}>POINTS</a></Link></li>
    </ul>
  )
}