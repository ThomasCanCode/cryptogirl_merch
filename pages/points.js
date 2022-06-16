import Script from "next/script";
import React, { Component, useState, useEffect } from "react";
import ProgressBarCountdown from "../components/progressbarcountdown";
import styles from "../styles/Home.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const connectAtom = atomWithStorage("connectPersistant", false);
const accountAtom = atomWithStorage("accountPersistant", "0x");

export default function Home() {
  const [firstHeading, setFirstHeading] = useState("COME BACK ON THE 1ST");
  const [collect, setCollect] = useState(false);
  const [total_points, setTotal_points] = useState(0);
  const [hasUnclaimedPoints, setHasUnclaimedPoints] = useState(false);

  const [isConnected, setIsConnected] = useAtom(connectAtom);
  const [account, setAccount] = useAtom(accountAtom);


  useEffect(() => {
    if (window.ethereum != undefined) {
      window.ethereum.on("accountsChanged", function (accounts) {
        // Time to reload your interface with accounts[0]!
        let tempAccount = accounts[0];
        // console.log('this is temp account '+tempAccount)
        if (tempAccount) {
          if (tempAccount.length == 42) {
            setAccount(tempAccount);
            fetch("api/get_points?wallet=" + tempAccount)
              .then((res) => res.json())
              .then((data) => {
                setTotal_points(data.points);
              });
          } else {
            console.log(tempAccount.length);
          }

          setIsConnected(true);
        } else {
          setIsConnected(false);
          setHasUnclaimedPoints(false);
          setAccount("0x");
        }
      });
    }
  }, [setAccount, account, setIsConnected]);

  useEffect(() => {
    if (account != "0x") {
      setIsConnected(true);
      fetch("api/get_points?wallet=" + account)
        .then((res) => res.json())
        .then((data) => {
          setTotal_points(data.points);
        });

      global.account = account;
    } else {
      setIsConnected(false);
    }
  }, [account, setIsConnected]);

  useEffect(() => {
    if (total_points > 0) {
      setFirstHeading("YOU HAVE UNUSED POINTS!");
      setCollect(true);
      setHasUnclaimedPoints(true);
    } else if (total_points === 0) {
      setHasUnclaimedPoints(false);
    } else if (total_points == "not_found") {
      setFirstHeading("Welcome to CRYPTOGIRL rewards!");
      setCollect(false);
    }
  }, [total_points]);

  return (
    <div
      className={styles.points_page_container}
      suppressHydrationWarning={true}
    >
      <div>
        <h1>CRYPTOGIRL</h1>
        <h2>POINTS</h2>
        <ClientOnly>
          {isConnected ? <WalletConnected /> : <WalletNotConnected />}
          <div className={styles.slider_container_points}>
            {isConnected ? <Custom_carousel /> : <></>}
          </div>
          <p>
            Cryptogirl points is a source of passive income for all Cryptogirl NFT
            holders! The lucky few who have unique pieces receive massive rewards!
          </p>
        </ClientOnly>

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
        <h2 className={styles.unused_points}>{firstHeading}</h2>
        {collect ? <Collect /> : <NoCollect />}
      </>
    );
  }
  function Collect() {
    return (
      <>
        {/* <button className={styles.collect + " " + styles.animated_anchor}>
          COLLECT THEM NOW
        </button> */}
        <h5>YOUR TOTAL POINTS: {total_points}</h5>
      </>
    );
  }
  function NoCollect() {
    return (
      <h2>
        {
          "You have been registered, come back on the 1st to collect your points!"
        }
      </h2>
    );
  }
  function No_unclaimed() {
    return (
      <>
        <h2 className={styles.unused_points}>You have no points.</h2>
      </>
    );
  }
  function DisconnectBtn() {
    function disconnect() {
      if (typeof window.ethereum !== "undefined") {
        console.log("disconnect metamask");
        setAccount("0x");
        setIsConnected(false);
        window.location.reload();
      } else {
        const connector = new WalletConnect({
          bridge: "https://bridge.walletconnect.org", // Required
          qrcodeModal: QRCodeModal,
        });

        connector.killSession();
        setAccount("0x");
        setIsConnected(false);
      }
    }
    return (
      <button
        className={styles.withdraw + " " + styles.disconnect_button}
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    );
  }
  function WalletConnected() {
    return (
      <>
        <DisconnectBtn />
        {hasUnclaimedPoints ? <Unclaimed_points /> : <No_unclaimed />}
        <div className={styles.progress_container}>
          <div>
            <h6>FUTURE POINTS WILL BE READY&nbsp;IN:</h6>
          </div>

          <ClientOnly>
            <ProgressBarCountdown />
          </ClientOnly>
        </div>

        {/* {collect ? <button className={styles.withdraw + " " + styles.animated_anchor}>WITHDRAW</button> : <></> } */}
      </>
    );
  }
  async function connect() {
    if (window.ethereum) {
      try {
        global.account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(global.account);
        setIsConnected(true)
      } catch (error) {
        console.log(error);
      }
    } else {
      if (typeof window !== "undefined") {
        if (typeof window.ethereum !== "undefined") {
          console.log("Metamasks Present!");
        } else {
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
            } else {
              // console.log(payload)
              window.location.reload()
            }

            // Get provided accounts and chainId
            const { accounts, chainId } = payload.params[0];
            setAccount(accounts);
            setIsConnected(true);
          });

          connector.on("session_update", (error, payload) => {
            if (error) {
              throw error;
            } else {
              // console.log(payload)
            }

            // Get updated accounts and chainId
            const { accounts, chainId } = payload.params[0];
            global.account = accounts;
            setAccount(accounts);
            setIsConnected(true);
          });

          connector.on("disconnect", (error, payload) => {
            if (error) {
              throw error;
            } else {
              // console.log(payload)
            }

            window.location.reload()
            // Delete connector
          });

          if (connector.accounts[0]) {
            if (connector.accounts[0].startsWith("0x")) {
              setAccount(connector.accounts[0]);
              setIsConnected(true);
            }
          }
        }
      } else {
        console.log("Window not defined");
      }
      setIsConnected(false);
    }
  }

  function WalletNotConnected() {
    return (
      <>
        <h2 className={styles.marginTopBot}>
          Wallet not connected, please connect below!
        </h2>
        <button className={styles.withdraw} onClick={() => connect()}>
          Connect!
        </button>
      </>
    );
  }
}

export function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <div {...delegated}>{children}</div>;
}
let changeNFTCounter = 0;
let fetched_data;
export class Custom_carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: []
    };
  }
  componentDidMount() {
    if(changeNFTCounter === 0 && global.account){
      changeNFTCounter++
      Promise.resolve(fetch("/api/get_nfts?wallet="+ global.account))//
      .then((res)=>res.json())
      .then((final)=>{
        fetched_data = final;

        let url_prefix_collectables = "https://cryptogirlnft.io/assets_for_points/";
        var to_return = [];
    
        if (fetched_data.collectables.length > 0) {
          fetched_data.collectables.forEach((element) => {
            to_return.push(url_prefix_collectables + element + ".png");
          });
        }
        if (fetched_data.originals.length > 0) {
          console.log(fetched_data.originals)
          fetched_data.originals.forEach((element) => {
            let split;
            try {
              split = element.split('#')
              to_return.push(url_prefix_collectables + parseInt(split[1])  + ".m4v");
            } catch (error) {
              console.log(error)
            }
          });
        }

        this.setState({
          slides: to_return
        }, ()=>{
          // console.log('state set!')
          // console.log(fetched_data)
        });

        // Force a render without state change...
        // this.forceUpdate();
      });
    }
  }

  render() {
    let text = "YOUR CRYPTOGIRLS";
    var slidesToShow = 0;
    if (this.state.slides) {
      if (this.state.slides.length > 2) {
        slidesToShow = 3;
      } else if (this.state.slides.length == 2) {
        slidesToShow = 2;
      } else if (this.state.slides == 0) {
        text = "";
        slidesToShow = 0;
      } else {
        slidesToShow = 1;
      }
    }
    const settings = {
      arrows: true,
      slidesToShow: slidesToShow,
      slidesToScroll: 1,
      autoplay: true,
      speed: 1000,
      infinite: true,
      autoplaySpeed: 5000,
      width: 1000,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 999,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    if (this.state.slides) {
      if (this.state.slides.length > 0) {
        /* eslint-disable */
        return (
          <>
            <div>
              <h6>{text}</h6>
            </div>
            <div className={styles.points_slider} id="slider_carousel">
              <Slider {...settings}>
                {this.state.slides.map(function (slide) {
                  if(slide.endsWith('png')){
                    return (
                      <div key={slide}>
                        <img alt="" src={slide} className="nft_image" />
                      </div>
                    );
                  }else{
                    return (
                      <div key={slide}>
                        <video autoPlay muted loop  className="nft_video" >
                          <source src={slide} type="video/mp4"/>
                        </video>
                      </div>
                    );
                  }
                })
                }
              </Slider>
            </div>
          </>
        );
      } else {
        return (
          <h2 className={styles.no_cgc}>You have no CryptoGirl Collectables, you can buy some  
          <a href="https://opensea.io/collection/cryptogirl-collectables" target="_blank" rel="noreferrer noopener"> here</a>!</h2>
        )}
    }
  }
}
