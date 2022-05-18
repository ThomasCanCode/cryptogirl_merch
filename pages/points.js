import Script from "next/script";
import React, { Component, useState, useEffect } from "react";
import ProgressBarCountdown from "../components/progressbarcountdown";
import styles from "../styles/Home.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import dynamic from "next/dynamic";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import useSWR from 'swr'


const DynamicComponentWithCustomLoading = dynamic(() =>
  import("../components/connect.jsx"),
);


export default function Home() {
  const [firstHeading, setFirstHeading] = useState("COME BACK ON THE 1ST")
  const [collect, setCollect] = useState(false);
  const [total_points, setTotal_points] = useState(0)
  const [hasUnclaimedPoints, setHasUnclaimedPoints] = useState(false);
  const [openseaData, setOpenseaData] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("0x");

  const childToParent = (childdata) => {
    setOpenseaData(childdata);
  };

  useEffect(() => {
    if(account != "0x"){
      setIsConnected(true)
      fetch('api/get_points?wallet='+account)//+account
      .then((res) => res.json())
      .then((data) => {
        setTotal_points(data.points);
      })

      console.log(account)
    }
  }, [account])

  useEffect(() => {
    if(total_points > 0){
      setFirstHeading('YOU HAVE UNCLAIMED POINTS!')
      setCollect(true)
      setHasUnclaimedPoints(true)
    }else if(total_points == "not_found"){
      setFirstHeading("Welcome to CRYPTOGIRL rewards!")
      setCollect(false)
    }
  }, [total_points])


  
  return (
    <div className={styles.points_page_container}>
      <div>
        <h1>CRYPTOGIRL</h1>
        <h2>POINTS</h2>

        {isConnected ? <WalletConnected /> : <WalletNotConnected />}

        <DynamicComponentWithCustomLoading
          childToParent={childToParent}
          onLoad={() => {
            console.log("dynamic component loaded!");
          }}
        />

        <Script
          src="/static/inline.js"
          onLoad={() => {
            // If loaded successfully, then you can load other scripts in sequence
          }}
        />
      </div>
    </div>
  );

  function Unclaimed_points() {
    return (
      <>
        <h2>{firstHeading}</h2>
        {collect ? <Collect/> : <NoCollect />}
      </>
    );
  }
  function Collect(){
    return (
      <>
        <button className={styles.collect + " " + styles.animated_anchor}>
          COLLECT THEM NOW
        </button>
        <h5>YOUR TOTAL POINTS: {total_points}</h5>
      </>
    )
  }
  function NoCollect(){
    return (<h2>{'You have been registered, come back on the 1st to collect your points!'}</h2>)
  }
  function No_unclaimed() {
    return (
      <>
        <h2>You have no unclaimed points.</h2>
      </>
    );
  }
  function WalletConnected() {
    return (
      <>
        {hasUnclaimedPoints ? <Unclaimed_points /> : <No_unclaimed />}
        <div className={styles.progress_container}>
          <div>
            <h6>FUTURE POINTS WILL BE READY&nbsp;IN:</h6>
          </div>
          <ProgressBarCountdown />
        </div>

        <div className={styles.slider_container_points}>
          <Custom_carousel slides={changeNFTimages()} />
        </div>

        <p>
          Cryptogirl points is a source of passive income for all Cryptogirl NFT holders!
          The lucky few who have unique pieces receive massive rewards!
        </p>

        {collect ? <button className={styles.withdraw + " " + styles.animated_anchor}>WITHDRAW</button> : <></> }
      </>
    );
  }
  async function connect(){
    if(window.ethereum){
      try {
        global.account = await ethereum.request({method: "eth_requestAccounts"});
        setAccount(global.account);
  
      } catch (error) {
        if(error.code === 4001){
          alert("maybe show connect button?")
        }else{
          console.log(error)
        }
      }
    }else{
      if(typeof window !== "undefined"){
        console.log("Window defined");
        if(typeof window.ethereum !== "undefined"){
          console.log('Metamasks Present!')
        }else{
          //wallet connect 
          // Create a connector
          const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
          });
      
          // Check if connection is already established
          if (!connector.connected) {
            // create new session
            connector.createSession();
          }
      
          // Subscribe to connection events
          connector.on("connect", (error, payload) => {
            if (error) {
              throw error;
            }else{
              console.log(payload)
            }
      
            // Get provided accounts and chainId
            //const { accounts, chainId } = payload.params[0];
          });
      
          connector.on("session_update", (error, payload) => {
            if (error) {
              throw error;
            }else{
              console.log(payload)
            }
      
            // Get updated accounts and chainId
            //const { accounts, chainId } = payload.params[0];
          });
      
          connector.on("disconnect", (error, payload) => {
            if (error) {
              throw error;
            }else{
              console.log(payload)
            }
      
            // Delete connector
          });
      
        }
      }else{
        console.log('Window not defined')
      }
      setIsConnected(false);
    }
  }
  
  
  
  function WalletNotConnected() {
    return (
      <>
        <h2 className={styles.marginTopBot}>Wallet not connected, please connect below!</h2>
        <button className={styles.withdraw} onClick={() => connect()}>Connect!</button> 
      </>
    );
  }
}


export async function changeNFTimages(){
  let opensea_api_url = "https://api.opensea.io/api/v1/assets?format=json&owner="+global.account;

  const api_call = await fetch(opensea_api_url);
  const data = await api_call.json();
  var to_return = [];

  data.assets.forEach(element => {
    to_return.push(element.image_url);
  });
  return to_return;
}
export class Custom_carousel extends Component {
  constructor(props){
    super(props);
    this.state = {
      slides: []
    };
  }

  async componentDidMount(){
    const promise = Promise.resolve(changeNFTimages()).then((result)=>{

      const { slides } = this.state;
      this.setState({
        slides: result
      });
    })
  }
  render() {
    let text = "YOUR CRYPTOGIRLS"
    var slidesToShow = 0;
    if(this.state.slides.length > 2){
      slidesToShow = 3;
    }else if(this.state.slides.length == 2){
      slidesToShow = 2;
    }else if(this.state.slides == 0){
      text = '';
      slidesToShow = 0;
    }else{
      slidesToShow = 1
    }
    const settings = {
      arrows: true,
      slidesToShow: slidesToShow,
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
          },
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    /* eslint-disable */
    return (
      <>
        <div>
          <h6>{text}</h6>
        </div>
        <div className={styles.points_slider} id="slider_carousel">
          <Slider {...settings}>
            {this.state.slides.map(function(slide) {
              return (
                <div key={slide}>
                  <img alt="" src={slide} className="nft_image" />
                </div>
              );
            })}
          </Slider>
        </div>
      </>
    );
  }
}
