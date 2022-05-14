import Script from 'next/script'
import React, { Component, useState } from "react";
import ProgressBarCountdown from "../components/progressbarcountdown";
import styles from '../styles/Home.module.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import dynamic from 'next/dynamic'

var total_points = 10


const DynamicComponentWithCustomLoading = dynamic(
    () => import('../components/connect.jsx')
  )


// export async function getStaticProps() {

//   console.log('yea')
//   // ...
//   return {
//     props: {
//       posts,
//     },
//   }
// }


export default async function Home() {

  const [testt, setTest] = useState(false);

  function totalPoints(){
     total_points = 100;
    console.log('points: '+total_points)
    setTest(false)

  }

  function PointsArea(){
    
    if(total_points > 10){
      return (
        <>
          <h2>YOU HAVE UNCLAIMED POINTS!</h2>
          <button className={styles.collect+" "+styles.animated_anchor}>COLLECT THEM NOW</button>
          <h5>YOUR TOTAL POINTS: {total_points}</h5> 
        </>
      )
    }else{
      return (
        <>
          <button onClick={totalPoints}>add points</button>
          <h2>Vino altadata mancatias</h2>
        </>
      )
    }
 }

 function PointsAreaa(){
  function totalPoints(){
     total_points = 100;
    console.log('points: '+total_points)
    setTest(true)

  }
  

    return (
      <>
        <button onClick={totalPoints}>add points</button>
        <h2>Vino altadata mancatissssssssas</h2>
      </>
    )
  
}

 
  return (
    <div className={styles.points_page_container}>
      <div>

        <h1>CRYPTOGIRL</h1>
        <h2>POINTS</h2>
        {testt ? <PointsArea/>  : <PointsAreaa/>  }

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


        <DynamicComponentWithCustomLoading
          onLoad={() => {
            console.log('yeaa')
          }} />
      
        <Script
          src="/static/inline.js" 
          onLoad={() => {
            // If loaded successfully, then you can load other scripts in sequence
            console.log('inline.js loaded!')
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
    /* eslint-disable */
    return (
      <div className={styles.points_slider}>
        <Slider {...settings}>
          <div>
            <img alt="" src='/static/images/demo_1.png' className="nft_image"/> 
          </div>

          <div>
            <img alt="" src='/static/images/demo_2.png' className="nft_image" />
          </div>

          <div>
            <img alt="" src='/static/images/demo_3.png' className="nft_image" />
          </div>

          <div>
            <img alt="" src='/static/images/demo_1.png' className="nft_image" />
          </div>
        </Slider>
      </div>
    );
  }
}
