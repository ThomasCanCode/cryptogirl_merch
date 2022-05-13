import Image from 'next/image'
import Script from 'next/script'
import React, { Component } from "react";

import styles from '../styles/Home.module.css'
import product_styles from "../styles/product.module.css"

import logo from '/static/images/logo.png'
import banner from '/static/images/top.jpg'
import sneakers from '/static/images/sneakers.png'
import jacket from '/static/images/jacket.png'
import black_sneakers from '/static/images/black_sneakers.png'
import canvas_prints from '/static/images/canvas_prints.jpg'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import Footer from "../components/footer"
import Menu from "../components/menu"
import Socials from "../components/socials"

import Product_page from '../components/product_page';

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
    <div className={product_styles.product}>
      <div className={product_styles.product_image}>
        <Image alt="Product" src={props.src} height={props.height} width={props.width} blurDataURL={props.blurDataURL} />
      </div>
      <h5 className='audiowide'>{props.title}</h5>
      <h6 className='verdana'>{props.price}</h6>
      <a href={props.link} className='audiowide'>BUY NOW</a>
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

      <Product_page products="test" type="converse" title="custom converse high tops" price="250"/>


      <Footer/>

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
          <Product title="CUSTOM PAINTED SNEAKERS" price="$150" link="#link" src={sneakers} />
          <Product title="CUSTOM DENIM JACKET" price="$400" link="#link" src={jacket} />
          <Product title="CUSTOM PAINTED SNEAKERS" price="$150" link="#link" src={black_sneakers} />
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
          <Product title="LARGE" price={large_canvas_desc} link="#link" src={canvas_prints} />
          <Product title="MEDIUM" price={medium_canvas_desc} link="#link" src={canvas_prints} />
          <Product title="SMALL" price={small_canvas_desc} link="#link" src={canvas_prints} />
        </Slider>
      </div>
    );
  }
}