import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useEffect, useState } from "react";



export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [account, setAccount] = useState('0x');

  useEffect(() => {
    connect();
    if (typeof window.ethereum !== undefined && typeof window !== "undefined") {
      setHasMetamask(true);
    }
  },[]);

  useEffect(() => {
    if(isConnected){
      console.log('mam conectat smr '+isConnected)
      changeNFTimages();

      async function changeNFTimages(){
        let opensea_api_url = "https://api.opensea.io/api/v1/assets?format=json&owner=0x3698ee3FdCF200154C646763c4Ca8719dB4eD3E7";
        if(isConnected && hasMetamask){

          const getAllAssets = async() => {
              const api_call = await fetch(opensea_api_url);
              const data = await api_call.json();
              data.assets.forEach(element => {
                console.log(element.image_url)
              });
          }
    
            getAllAssets();
    
          //https://api.opensea.io/api/v1/assets?format=json&owner=0x3698ee3FdCF200154C646763c4Ca8719dB4eD3E7
        }
      }
    

    }
}, [isConnected, hasMetamask])


  async function connect(){
    if(window.ethereum){
      try {
        setAccount(await ethereum.request({method: "eth_requestAccounts"}));
        setIsConnected(true);

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



  (async function() {
    // let provider = new ethers.providers.JsonRpcProvider(rpcURL);
    // let total_contract = new ethers.Contract(contractAddress, abi, provider);
    // var totalSupply = await total_contract.totalSupply();
    // document.getElementById("minted_total").innerHTML = totalSupply + " / 10000 minted";
  })();



  //get total supply
  // connect
  /// minting steps, getSigner (if whitelisted), if not just mint straight

  return (
    <></>
  );
}