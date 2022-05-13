import Image from 'next/image'
import Script from 'next/script'
import React, { Component } from "react";
import ProgressBarCountdown from "../components/progressbarcountdown";
import styles from '../styles/Home.module.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import demo_1 from '/static/images/demo_1.png'
import demo_2 from '/static/images/demo_2.png'
import demo_3 from '/static/images/demo_3.png'

var total_points = 10

import dynamic from 'next/dynamic'

const DynamicComponentWithCustomLoading = dynamic(
    () => import('../components/connect.jsx'), 
    { loading: () => <p>...</p> }
  )
  
export default function Home() {
  return (
    <div className={styles.points_page_container}>
      <div>
        <h1>CRYPTOGIRL</h1>
        <h2>POINTS</h2>
        <h2>YOU HAVE UNCLAIMED POINTS!</h2>
        <button className={styles.collect+" "+styles.animated_anchor}>COLLECT THEM NOW</button>
        <h5>YOUR TOTAL POINTS: {total_points}</h5>   

        <div className={styles.progress_container}>
          <div>
            <h6>YOUR FUTURE POINTS WILL BE READY&nbsp;IN:</h6>
          </div>
          <ProgressBarCountdown/>
        </div>

        <div className={styles.slider_container_points}>
          <div>
            <h6>YOUR CRYPTOGIRLS</h6>
          </div>
          <Custom_carousel />
        </div>

        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sagittis consequat massa tristique leo. Ipsum in massa et sodales amet scelerisque vulputate. </p>

        <button className={styles.withdraw}>WITHDRAW</button>


        <DynamicComponentWithCustomLoading />
      
        <Script
          src="/static/inline.js" 
          onLoad={() => {
            // If loaded successfully, then you can load other scripts in sequence
          }}
        />
      </div>
    </div>
  )
}




const settings = {
  arrows: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  infinite: true,
  autoplaySpeed: 5000,
  responsive: [
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
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
      <div className={styles.points_slider}>
        <Slider {...settings}>
          <div>
            <Image alt="" src={demo_1} />
          </div>

          <div>
            <Image alt="" src={demo_2} />
          </div>

          <div>
            <Image alt="" src={demo_3} />
          </div>

          <div>
            <Image alt="" src={demo_1} />
          </div>
        </Slider>
      </div>
    );
  }
}
