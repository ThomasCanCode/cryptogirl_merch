import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useEffect, useState } from "react";



export default function Home({childToParent}) {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [account, setAccount] = useState("0x");
  const [walletConnected, setWalletConnected] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== undefined && typeof window !== "undefined") {
      setHasMetamask(false);
    }else{
      connect()
      setHasMetamask(true);
    }
  },[]);

  useEffect(() => {
    if(typeof window !== "undefined"){
      if(isConnected){
        console.log('Connected! '+account)
        changeNFTimages();
        async function changeNFTimages(){
          let opensea_api_url = "https://api.opensea.io/api/v1/assets?format=json&owner="+account;
          if(isConnected && hasMetamask){

            const getAllAssets = async() => {
              const api_call = await fetch(opensea_api_url);
              const data = await api_call.json();

              childToParent(data)

            }
      
            getAllAssets();
          }
        }
      }
    }
  }, [childToParent])

}



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


