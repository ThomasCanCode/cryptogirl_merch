import Image from 'next/image'
import Script from 'next/script'
import React, { Component } from "react";

import styles from '../styles/Home.module.css'
import Link from 'next/link';
import logo from '/static/images/logo.png'
import banner from '/static/images/top.jpg'
import hoodies from '/static/images/hoodies.jpg'
import wide_banner from '/static/images/wide_banner.png'
import hand_painted_background from '/static/images/hand_painted_background.jpg'
import sneakers from '/static/images/sneakers.png'
import jacket from '/static/images/jacket.png'
import black_sneakers from '/static/images/black_sneakers.png'
import canvas_prints_background from '/static/images/canvas_prints_background.jpg'
import canvas_prints from '/static/images/canvas_prints.jpg'
import post_canvas_bg from '/static/images/post_canvas_bg.jpg'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Footer from "../components/footer"
import Menu from "../components/menu"
import Socials from "../components/socials"

const large_canvas_desc = (
  <>90cm x 90cm (CGC)<br/>90cm x 60cm (CGO)<br/>$110 usdt including<br/>worldwide postage</>
);
const medium_canvas_desc = (
  <>75cm x 75cm (CGC)<br/>63cm x 42cm (CGO)<br/>$98 usdt including<br/>worldwide postage</>
);
const small_canvas_desc = (
  <>50cm x 50cm (CGC)<br/>36cm x 24cm (CGO)<br/>$45 usdt including<br/>worldwide postage</>
);

export function toggleBurger(){
  document.getElementById('burgerContainer').classList.toggle('change') 
  document.getElementById('mobile_menu').classList.toggle('change') 
}

export function BurgerButton(){
  return (
    <div id='burgerContainer' className={styles.burgerContainer+" burger_opener"}  onClick={(e) => toggleBurger()}><div></div><div></div><div></div></div>
  )
}

export function Product(props){
  return (
      <div className={styles.product}>
        <div className={styles.product_image}>
          <Image alt="Product" src={props.src} height={props.height} width={props.width} blurDataURL={props.blurDataURL} />
        </div>
        <h5 className='audiowide'>{props.title}</h5>
        <h6 className='verdana'>{props.price}</h6>
        <Link href={`/product/${props.name.toLowerCase()}`} passHref>
          <a className='audiowide'>BUY NOW</a>
        </Link>
      </div>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.top_section}>
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
        <div id="mobile_menu" className={styles.mobile_menu}>
          <Menu/>
          <Socials/>
        </div>
        <Image className={"js_scroll slide-down"} alt="Project advisor" src={banner} />
      </div>

      <div className={styles.hoodies_section}>
        <div className={styles.hoodies_subcontainer}>
          <div><Image alt='' src={hoodies} /></div>

          <div>
            <h2 className='heaters'>Custom digital print merchandise</h2>
            <h3 className='pragmatica'>for Crypto Girl Collectable holders </h3>
            <h5 className='pragmatica'>Receive a personalized Tee with your NFT on it when you mint your Crypto Girl Collectable!</h5>
          </div>
        </div>
        <Image alt='Banner' src={wide_banner} />
      </div>

      <div className={styles.hand_painted}>
        <div className={styles.hand_painted_background} ><Image alt='Hand Painted Background' src={hand_painted_background} /></div>
        <h2 className='audiowide'>HAND PAINTED CUSTOM PIECES</h2>

        <div className={styles.products_container}>  
          <Product name="white_sneakers" title="CUSTOM WHITE CONVERSE" price="$150" src={sneakers} />
          <Product name="jacket" title="CUSTOM DENIM JACKET" price="$400" src={jacket} />
          <Product name="black_sneakers" title="CUSTOM BLACK CONVERSE" price="$150" src={black_sneakers} />
          
          <Custom_carousel/>
        </div>

        <div className={styles.post_products_creation}>
          <h2 className='audiowide'>CUSTOM HAND PAINTED JACKET</h2>
          <p className="verdana">Customize selected merchandise pieces and have your NFT hand painted on an item from one of our selected artists from around the world. Currently customizing vintage Denim Jackets and Converse High tops with items to rotate quarterly.</p>
          <a className={styles.animated_anchor} href='#'>START YOUR CREATION</a>
        </div>
      </div>

      <div className={styles.hand_painted+" "+styles.canvas_prints_container}>
        <div className={styles.hand_painted_background} ><Image alt='Canvas Prints' src={canvas_prints_background} /></div>
        <h2 className='audiowide'>CANVAS PRINTS</h2>

        <div className={styles.products_container}>
          <Product name="canvas_large" title="LARGE" price={large_canvas_desc} src={canvas_prints} />
          <Product name="canvas_medium" title="MEDIUM" price={medium_canvas_desc} src={canvas_prints} />
          <Product name="canvas_small" title="SMALL" price={small_canvas_desc} src={canvas_prints} /> 
          <Canvas_carousel/>
        </div>

        <div className={styles.post_products_creation}>
          <Image alt='' src={post_canvas_bg} />
        </div>
        
        <Footer/>
      </div>

      <Script
        src="/static/inline.js" 
        onLoad={() => {
          // If loaded successfully, then you can load other scripts in sequence
        }}
      />
    </div>
  )
}




const settings = {
  arrows: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 5000,
  responsive: [
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};
export class Custom_carousel extends Component {
  render() {
    return (
      <div className={styles.slider}>
        <Slider {...settings}>
         
          <Product name="sneakers" title="CUSTOM PAINTED SNEAKERS" price="$150" src={sneakers} />
          <Product name="jacket" title="CUSTOM DENIM JACKET" price="$400" src={jacket} />
          <Product name="sneakers" title="CUSTOM PAINTED SNEAKERS" price="$150" src={black_sneakers} />
        </Slider>
      </div>
    );
  }
}
export class Canvas_carousel extends Component {
  render() {
    return (
      <div className={styles.slider}>
        <Slider {...settings}>
          <Product name="canvas" title="LARGE" price={large_canvas_desc} src={canvas_prints} />
          <Product name="canvas" title="MEDIUM" price={medium_canvas_desc} src={canvas_prints} />
          <Product name="canvas" title="SMALL" price={small_canvas_desc} src={canvas_prints} />
        </Slider>
      </div>
    );
  }
}