import styles from '../styles/Home.module.css'
import Image from 'next/image'
 
import discord_img from '/static/images/discord.png'
import instagram_img from '/static/images/instagram.png'
import twitter_img from '/static/images/twitter.png'

export default function Socials(){
  
  const discord = "https://discord.com/invite/cryptogirlnft";
  const instagram = "https://www.instagram.com/cryptogirl.nft/";
  const twitter = "https://twitter.com/CryptoGirlNFT_";

  return (
    <div className={styles.socials_container}>
      <a href={discord} target="_blank" rel="noreferrer" className={styles.menuLinks+" "+styles.animated_anchor}><Image alt="Discord" src={discord_img} /></a>
      <a href={instagram} target="_blank" rel="noreferrer" className={styles.menuLinks+" "+styles.animated_anchor}><Image alt="Instagram" src={instagram_img} /></a>
      <a href={twitter} target="_blank" rel="noreferrer" className={styles.menuLinks+" "+styles.animated_anchor}><Image alt="Twitter" src={twitter_img} /></a>
    </div>
  )
}