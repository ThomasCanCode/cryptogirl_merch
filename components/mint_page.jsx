import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from "react";

import { ethers, providers } from "ethers";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import logo from '/static/images/logo.png'

const non_hex_deployed_chain = '1';
const contractAddress = "0x98c0F97645ac24ad39b6Fd781dfC82458ede8176";
const abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_initBaseURI","type":"string"},{"internalType":"string","name":"_initNotRevealedUri","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressMintedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftPerAddressLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"notRevealedUri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"onlyWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newCost","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"setNftPerAddressLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_notRevealedURI","type":"string"}],"name":"setNotRevealedURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"setOnlyWhitelisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newmaxMintAmount","type":"uint256"}],"name":"setmaxMintAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_users","type":"address[]"}],"name":"whitelistUsers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"whitelistedAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}];
const rpcURL = "https://mainnet.infura.io/v3/d8737054b1a0401282cb8624a060fc7f"//////////add link from infura here, new project -> ethereum mainet -> get link either "https://mainnet.inf..." or "wss://mainnet.infura"             
var account;
const deployed_chain = '0x'+non_hex_deployed_chain;

const mint_page_details_static = {
  total_supply: 6.666,
  short_nft_name: 'MMNFT',
  gwei_cost: 50000000,
  nft_per_address_limit: 100,
  cost: 0.05,
  currency_shortname_userfriendly: 'ETH',
  blockchain_userfriendly_name: 'Ethereum',
}





          //wallet connect 
          // Create a connector
          const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
          });



          
export default function Mint_page() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(undefined);

  useEffect(() => {
    async function web3page_init(){
      let provider = new providers.JsonRpcProvider(rpcURL);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      let total_contract = new ethers.Contract(contractAddress, abi, provider);
      var totalSupply = await total_contract.totalSupply();

      if (typeof window !== 'undefined') {
        //document.getElementById("minted_total").innerHTML = totalSupply + " / "+mint_page_details_static.total_supply+" minted";

        if(window.ethereum){
            try{
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              window.ethereum.on('accountsChanged', function (accounts) {
                // Time to reload your interface with accounts[0]!
                setAddress();
              })
              let requested_account = await ethereum.request({method: "eth_requestAccounts"});
              setAddress(requested_account)

              provider.on("network", async (newNetwork, oldNetwork)  =>  {
                  if(newNetwork.chainId !== parseInt(non_hex_deployed_chain)){
                    console.log(`Please change network to ${mint_page_details_static.blockchain_userfriendly_name}, current chainId ${newNetwork.chainId} target chainId ${non_hex_deployed_chain}`)
                    requestNetworkChange();
                  }
                  if (oldNetwork) {
                      window.location.reload();
                  }
              });
          }catch(err){
            console.log(err)
          }
        }else{
          setAddress(connector.accounts)
        }
        
      }
      web3page_init();
    }
  },[])

  async function mainButton(){
    if(isConnected){
      mint();
    }else{
      connect();
    }
  }





  async function setAddress(current_account = ""){
    if(typeof current_account === "object"){
      current_account = current_account.toString();
    }
    if(window.ethereum){
      const isMetaMaskConnected = async () => {
        try{
          let provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          return accounts[0];
        }catch(err){
          console.log(err)
        }
      }
      
      await isMetaMaskConnected().then((connected) => {
          if (connected) {
            account = connected;
            //document.getElementById("current_address").innerHTML = account;
            document.getElementById("connect").innerHTML = "MINT NOW";
            setIsConnected(true);
          } else {
            console.log('metamask is not connected');
          }
      });
    }else{

      if(connector.accounts.length > 0){
        //document.getElementById("current_address").innerHTML = current_account;
        document.getElementById("connect").innerHTML = "MINT NOW";
        account = current_account;
        setIsConnected(true);
      }else{
        console.log('account not connected yet' )
      }
    }
  }

  //get total supply
  // connect
  /// minting steps, getSigner (if whitelisted), if not just mint straight
  // wrong blockchain error, check blockchain try & change it

  
  function alert_user(message){
    console.log(message)
  }



  /*********************************CONNECT */

  function onConnect(payload){
    const { chainId, accounts } = payload.params[0];
    account = accounts[0];
    setAddress(accounts[0]);
    setIsConnected(true);
  }
  async function connect(){
    if(window.ethereum){
      try {
        let account = await ethereum.request({method: "eth_requestAccounts"});
        setAddress();
        setIsConnected(true);
        let connectedProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        setSigner(connectedProvider.getSigner());
        return account;
      } catch (error) {
        console.log(error)
      }
    }else{
      if(typeof window !== "undefined"){
        console.log("Window defined");
        console.log("typeof window.ethereum " + typeof window.ethereum);
        if(typeof window.ethereum !== "undefined"){
          console.log('Metamask Present!')
        }else{
          console.log('Metamask not Present!')
          // Check if connection is already established
          if (!connector.connected) {
            // create new session
            connector.createSession();
          }else{
            console.log('Connector defined')
            mint();
          }
          // Subscribe to connection events

          connector.on("connect", (error, payload) => {
            if (error) {
              throw error;
            }
            // Get provided accounts and chainId

            const { chainId, accounts } = payload.params[0];

            if(parseInt(chainId) == parseInt(non_hex_deployed_chain)){
              console.log('ChainId matches!')
              onConnect(payload)
            }else{
              requestNetworkChange();
            }
    
          });
          connector.on("session_update", async (error, payload) => {      
            if (error) {
              throw error;
            }
      
            const { chainId, accounts } = payload.params[0];
            alert_user('New chain id is '+chainId);
            alert_user('New accounts id is '+accounts);
            onConnect(payload)
          });

          connector.on('accountsChanged', (error, payload) => {
            if (error) {
              throw error;
            }
            console.log(payload)
            alert_user('account changed')
            alert_user(payload)
          });

          connector.on("disconnect", (error, payload) => {
            if (error) {
              throw error;
            }
            // Delete connector
            setIsConnected(false);
            console.log('disconnect')
          });
      
        }
      }else{
        console.log('Window not defined')
      }
      setIsConnected(false);
    }
  }
  /****************************************** */
  async function mint(){
    console.log('Minting with ' + account)
    if (window.ethereum) {
      try {
        var pret_final,est;

        account = await ethereum.request({method: "eth_requestAccounts"});
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        var number_for_mint = document.getElementById("number_for_mint").value;
        let pret_final_in_gwei = mint_page_details_static.gwei_cost * number_for_mint;
        pret_final = ethers.utils.hexlify(ethers.utils.parseUnits(pret_final_in_gwei.toString(), 'gwei'));
      
        const contract = new ethers.Contract(contractAddress, abi, signer);

          let nftTx = await contract.mint(number_for_mint, {value: pret_final})
          console.log('Mining....', nftTx.hash)

          let tx = await nftTx.wait()
          console.log('Mined!', tx)

          console.log(
            `Mined, see transaction: https://etherscan.io/tx/${nftTx.hash}`
          )
 
      } catch (e) {
        let error_String = e.toString();
        if(error_String.indexOf('exceeded') > -1){
          alert_user(`There is a max of ${mint_page_details_static.nft_per_address_limit} mints per wallet. You have reached the limit.`);
        }else if((e.code = -32603) || (error_String.indexOf('insufficient') > -1)){
          alert(`You have insufficient funds to complete this transaction. Load up on ${mint_page_details_static.currency_shortname_userfriendly} and try again!`);
          return;
        }
        console.log(error_String.indexOf('insufficient') > -1)
        console.log(e);
      }
    }else{
      console.log('non metamask, but try to mint')
      mintWalletConnect();
    }
  }
  async function mintWalletConnect(){
    if (!connector) {
      alert('Connector not existent')
      return;
    }


try {
  // const windowethereum = new WalletConnectProvider({
  //   infuraId: "e8857ba3c9f7468ca20b4bcc858008e4"
  // });
  const windowethereum = new WalletConnectProvider({
    rpc: {non_hex_deployed_chain: rpcURL},
  });
  await windowethereum.enable();

    var pret_final,est;

    //account = await ethereum.request({method: "eth_requestAccounts"});
    let provider = new providers.Web3Provider(windowethereum);
    const signer = provider.getSigner();

    var number_for_mint = document.getElementById("number_for_mint").value;
    let pret_final_in_gwei = mint_page_details_static.gwei_cost * number_for_mint;
    pret_final = ethers.utils.hexlify(ethers.utils.parseUnits(pret_final_in_gwei.toString(), 'gwei'));
  
    const contract = new ethers.Contract(contractAddress, abi, signer);
     //let contract = new ethers.Contract(contractAddress, abi, provider);

     let nftTx = await contract.mint(number_for_mint, {value: pret_final})
      console.log('Mining....', nftTx.hash)

      let tx = await nftTx.wait()
      console.log('Mined!', tx)

      console.log(
        `Mined, see transaction: https://etherscan.io/tx/${nftTx.hash}`
      )


    } catch (error) {
      console.error(error);
    }
  }
  /************************************************ */
  function killAndRestartSession(){
    if (connector.connected) {
      connector.killSession()
      window.location.reload();
    }else{
      console.log('already disconnected')
    } 
  }
  function DisconnectButton(){//add discconect for desktop to
    if(typeof window !== 'undefined'){
      if (!connector.connected) {
        return (
          <button onClick={() => killAndRestartSession()}>Disconnect</button>
        );
      }
    } 
    return (<></>);
  }
  function MetamaskDisconnectButton(){//add discconect for desktop to
    if(typeof window !== 'undefined'){
      if (isConnected) {
        return (
          <button onClick={() => killAndRestartSession()}>Disconnect</button>
        );
      }
    } 
    return (<></>);
  }

  function plus(){
    var current_nr = parseInt(number_for_mint.value);
    if(current_nr < number_for_mint.max){
        number_for_mint.value = current_nr+1;
    }
}
  
function minus(){
    var current_nr = parseInt(number_for_mint.value);
    if(current_nr > number_for_mint.min){
        number_for_mint.value = current_nr-1;
    }
}
  async function requestNetworkChange(){
    if(window.ethereum){
      try{
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: deployed_chain }],
        });
      } catch (err) {
         // This error code indicates that the chain has not been added to MetaMask.
        // if (err.code === 4902) {
        //   await window.ethereum.request({
        //     method: 'wallet_addEthereumChain',
        //     params: [
        //       {
        //         chainName: 'Polygon Mainnet',
        //         chainId: ethers.hexValue(parseInt(non_hex_deployed_chain)),
        //         nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
        //         rpcUrls: ['https://polygon-rpc.com/'],
        //       },
        //     ],
        //   });
        // }
        console.log(err)
      }
    }else{
      alert('Please change network to '+mint_page_details_static.blockchain_userfriendly_name)
    }
  }
//perhaps make variables for the front end texts and links/images
  return (
    <>
    {/* <DisconnectButton/>
    <MetamaskDisconnectButton/> */}
    <div className="body_container">
      
      <div className="overall_container">
       
        <div className="minting_container">
          <div className="logo_container"><a href="https://therapets.xyz/"><Image priority={true} alt="logo" src={logo}/></a></div>
          <h2>welcome to the Cryptogirl Mint page</h2>
          <div className="buttons_container">
            <button onClick={() => minus()}>-</button>
            <input type="number" id="number_for_mint" defaultValue="1" min="1" max={mint_page_details_static.nft_per_address_limit} />
            <button onClick={() => plus()}>+</button> 
          </div>
          <div><button id="connect" onClick={() => mainButton()}>CONNECT</button></div>
        </div>
      </div>
    </div>
    </>
  );
}