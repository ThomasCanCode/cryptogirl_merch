import Image from 'next/image'
import Script from 'next/script'
import React, { Component } from "react";

import styles from '../../styles/Home.module.css'

import logo from '/static/images/logo.png'
import banner from '/static/images/top.jpg'

import Footer from "../../components/footer"
import Menu from "../../components/menu"
import Socials from "../../components/socials"

import Product_page from '../../components/product_card';
import { getProductsByCategory } from '../api/products/[product]';
import Navbar from '../../components/Navbar';
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

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Navbar/>
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

      <Product_page key={props.products[0].id} product={props.products[0]} />


{/* <ProductCard key={props.products[0].id} product={props.products[0]} /> */}
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



export async function getServerSideProps(ctx) {
  const category = ctx.query.product;
  const products = await getProductsByCategory(category);
  return { props: { products } };
}