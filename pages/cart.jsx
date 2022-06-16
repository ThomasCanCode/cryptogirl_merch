import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
// Importing actions from  cart.slice.js
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  deleteCart
} from '../redux/slices/cartSlice';
import styles from '../styles/CartPage.module.css';
import ThomasHeader from "../components/ThomasHeader"
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import parse from 'html-react-parser';
import Script from 'next/script'
import { ethers, providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

const connectAtom = atomWithStorage("connectPersistant", false);
const accountAtom = atomWithStorage("accountPersistant", "0x");

const CartPage = () => {

  const [showModal, setShowModal] = useState(false);
  const [showCheckoutModal, setCheckoutModal] = useState(false);
  const [showPaymentModal, setPaymentModal] = useState(false);
  const [showManualModal, setManualModal] = useState(false);
  const [showPointsModal, setPointsModal] = useState(false);
  const [showWeb3Modal, setWeb3Modal] = useState(false);
  const [usersPoints, setusersPoints] = useState(0);
  const [modalText, setModalText] = useState('text');
  const [isConnected, setIsConnected] = useAtom(connectAtom);
  const [account, setAccount] = useAtom(accountAtom);

  const [userAddress, setuserAddress] = useState({});

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
          }else{
            if(connector.accounts[0]){
              global.account = connector.accounts[0];
            }
          }
  
          // Subscribe to connection events
          connector.on("connect", (error, payload) => {
            if (error) {
              throw error;
            } else {
              // console.log(payload)
            }
  
            // Get provided accounts and chainId

            const { accounts, chainId } = payload.params[0];
            global.account = accounts;
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
    

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getTotalPrice = () => {
    return cart.reduce(
      (accumulator, item) => accumulator + item.quantity * item.product.price,
      0
    );
  };
  function PointsModal(){
    
    return (
      <div className='modal_container'>
        <div className='modal_body'>
          <button className='modal_close' onClick={()=>setPointsModal(false)}>X</button>
          <h3>Points Checkout</h3>
          <p>You have enough points to pay, press button below and wait for email! </p> 
          <button className='blue_btn' onClick={() => paymentFinalStep('points')}>Pay with points</button>
        </div>
      </div>
    )
  }
  
  let wallet,currentUser,web3,contractInstance;
  let contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_upgradedAddress","type":"address"}],"name":"deprecate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"deprecated","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_evilUser","type":"address"}],"name":"addBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradedAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maximumFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_maker","type":"address"}],"name":"getBlackListStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newBasisPoints","type":"uint256"},{"name":"newMaxFee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"basisPointsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isBlackListed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_clearedUser","type":"address"}],"name":"removeBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_UINT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_blackListedUser","type":"address"}],"name":"destroyBlackFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAddress","type":"address"}],"name":"Deprecate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"feeBasisPoints","type":"uint256"},{"indexed":false,"name":"maxFee","type":"uint256"}],"name":"Params","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_blackListedUser","type":"address"},{"indexed":false,"name":"_balance","type":"uint256"}],"name":"DestroyedBlackFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"AddedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"RemovedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"}]
  let contractAddress = "0x5990941d462aBdfA924C12aAdb082d5C99b16BE9"; // USDT 0xdAC17F958D2ee523a2206206994597C13D831ec7
  let receiver = "0x5686bC2b30ee6078Df8E7727c08aEBE96aeA519A"; //Ross's account 0xFE9AE1a87fCa665Ff996eef3d871c128915ceaDb
  let currentChainId = "0x3";
  const rpcURL = "https://mainnet.infura.io/v3/d8737054b1a0401282cb8624a060fc7f"

  function Web3Modal(){

    let total_amount = cart.reduce((accumulator, item) => accumulator + item.quantity * item.product.price,0);

    async function web3OnLoad(){
      if (window.ethereum){
        console.log('line 163 window.eth present')
        web3 = new Web3(rpcURL);
          try {
              wallet = await ethereum.request({ method: 'eth_requestAccounts' })

              currentUser = wallet.toString()
              contractInstance = new web3.eth.Contract(contractABI,contractAddress);
          } catch(error) {
            console.log(error)
          }
      }else{
        connect()
        .then(()=>{
          const account_delay = setInterval(()=>{
            if(global.account){
              
              web3 = new Web3(rpcURL);
              contractInstance = new web3.eth.Contract(contractABI,contractAddress);
              currentUser = global.account
              clearInterval(account_delay)
            }
          },1000)
        })
      }
    }
    async function approve(){
      if(typeof window.ethereum != "undefined"){
        web3 = new Web3(rpcURL);
        contractInstance = new web3.eth.Contract(contractABI,contractAddress);
        const tx = {
          from: currentUser, 
          to: receiver,  
          data: contractInstance.methods.approve(currentUser,total_amount*100000).encodeABI(),
          chainId: currentChainId,
        };

        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        }).then((result) => {
            console.log('Approval successful! '+result);
        })
        .catch((error) => {
            console.log(error);
        });
      }else{
        try {
          var contract = async (abi, address) => {
            if (w3) {
              return new w3.eth.Contract(abi, address)
            } else {
              return false
            }
          }

                 
          const provider = new WalletConnectProvider({
            rpc: {1: rpcURL},
          });
      
            await provider.enable();

            //  Create Web3 instance
            const web3 = new Web3(provider);
            window.w3 = web3
      
            var accounts  = await web3.eth.getAccounts(); // get all connected accounts
            account = accounts[0]; // get the primary accoun

            var c = await contract (contractABI,contractAddress)
            var hash = await c.methods.approve(account,total_amount).send({from: account})//multople total_amount by decimals
            alert(hash)
            
            } catch (error) {
              console.error(error);
            }
          
      }
    }
  

    async function transfer(){
      console.log('trying')
      if(typeof window.ethereum != "undefined"){
        web3 = new Web3(rpcURL);
        contractInstance = new web3.eth.Contract(contractABI,contractAddress);
        const tx = {
          from: currentUser, 
          to: receiver,  
          data: contractInstance.methods.transferFrom(currentUser,receiver,total_amount*100000).encodeABI(),
          chainId: currentChainId,
        };

        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        }).then((result) => {
            console.log('Approval successful! '+result);
        })
        .catch((error) => {
            console.log(error);
        });
      }else{
        try {
          var contract = async (abi, address) => {
            if (w3) {
              return new w3.eth.Contract(abi, address)
            } else {
              return false
            }
          }
          console.log('defined inside th try')

                 
          const provider = new WalletConnectProvider({
            rpc: {1: rpcURL},
          });
      
            await provider.enable();

            //  Create Web3 instance
            const web3 = new Web3(provider);
            window.w3 = web3
      
            var accounts  = await web3.eth.getAccounts(); // get all connected accounts
            account = accounts[0]; // get the primary accoun

            var c = await contract (contractABI,contractAddress)
            
            var hash = await c.methods.transferFrom(account,receiver,total_amount*100000).send({from: account})//multople total_amount by decimals
            alert(hash)
            
            } catch (error) {
              console.log('aicea')
              console.error(error);
            }
          
        }
        
        // data: contractInstance.methods.transferFrom(currentUser,receiver,total_amount).encodeABI(),
    }

    return (
      <div className='modal_container'>
        <Script
        src="/static/web3.min.js"
        onLoad={() => {
          web3OnLoad()
        }}
      />
        <div className='modal_body'>
          <button className='modal_close' onClick={()=>setWeb3Modal(false)}>X</button>
          <h3>Crypto Checkout</h3>
          <p className={styles.paragraph}>To pay below with USDT, you need to approve access to {total_amount}USDT, after the transaction completes, please press &ldquo;Pay with USDT&ldquo;. </p> 
          <p className={styles.paragraph}>You can choose Manual transfer if you are concerned.</p>
          <button className='blue_btn' onClick={() => approve()}>APPROVE</button>
          <button className='blue_btn' onClick={() => transfer()}>Pay with USDT</button>
        </div>
      </div>
    )
  }
  function ManualModal(){
    let total_amount = cart.reduce((accumulator, item) => accumulator + item.quantity * item.product.price,0);

    function handleManualTransaction(e){
      e.preventDefault();
      let hash = e.target.hash.value;

      paymentFinalStep(hash)
    }
    return (
      <div className='modal_container'>
        <div className='modal_body'>
          <button className='modal_close' onClick={()=>setManualModal(false)}>X</button>
          <h3>Manual Checkout</h3>
          <p>Please send {total_amount}USDT to 0xFE9AE1a87fCa665Ff996eef3d871c128915ceaDb on ETH afterwards copy the transaction hash below! </p> 
          <form onSubmit={handleManualTransaction}>
            <input type="text" placeholder="Transaction hash" name="hash" required minLength={40} maxLength={66}/>
            <button className="blue_btn confirm_btn">CONFIRM</button>
          </form>
        </div>
      </div>
    )
  }

  function checkout(method){
    setPaymentModal(false)
    let total_amount = cart.reduce((accumulator, item) => accumulator + item.quantity * item.product.price,0);
    if(parseInt(total_amount) == 0){
      triggerModal('Sorry you do not have enough points!')
    }
    if(method === "points"){
      connect()
      .then(()=>{
        if(global.account){
          fetch("api/get_points?wallet=" + global.account.toString())
          .then((res) => res.json())
          .then((data) => {
              if(parseInt(data.points) >= parseInt(total_amount)){
                setPointsModal(true)
                setusersPoints(data.points)
              }else{
                triggerModal('Sorry you do not have enough points!')
              }
            });

        }
      })
    }

    if(method === "web3"){
      //approve,sendTransaction,save txhash to db & order / send email
      
      setPaymentModal(false)
      setWeb3Modal(true)

      //let hash = //the one usually console logged
      // paymentFinalStep(hash)
    }

    if(method === "manual"){
      setManualModal(true)
    }
  }


  try {
    return (
      <>
        <div className={styles.ThomasHeader}><ThomasHeader/> </div>   
        <div className={styles.container_shop}>
          {cart.length === 0 ? (
            <h1 className="pragmatica">Your Cart is Empty!</h1>
          ) : (
            <>
              <div className={styles.header_cartpage}>
                <div>Image</div>
                <div>Product</div>
                <div>Options</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Actions</div>
                {/* <div>Total Price</div> */}
              </div>


              {cart.map((item) => (
                <div className={styles.body} key={JSON.stringify(item.options)} >
                                {(true) ? (<></>) : (<></>)}
                  <div className={styles.image} onClick={()=>{window.location.href= '/product/'+item.product.product}}>
                    <Image src={item.product.images[0]} height="90" width="65" alt="" />
                  </div>
                  <p onClick={()=>{window.location.replace('/product/'+item.product.product)}}>{item.product.title}</p>
                  <ul className={styles.options_ul}>{
                  Object.keys(item.options).map(data => {
                    if(item.options[data]){
                      return (<li key={data}>{data+": "+item.options[data]}</li>)
                    }
                  })
                    }</ul>
                  <p>USDT {item.product.price}</p>
                  <p>{item.quantity}</p>
                  <div className={styles.buttons}>
                    <button onClick={() => dispatch(incrementQuantity(item))}>
                      +
                    </button>
                    <button onClick={() => dispatch(decrementQuantity(item))}>
                      -
                    </button>
                    <button onClick={() => dispatch(removeFromCart(item))}>
                      x
                    </button>
                  </div>
                  {/* <p>$ {item.quantity * item.product.price}</p> */}
                </div>
              ))}
              <h3>USDT {getTotalPrice()}</h3>
              <button className='blue_btn checkout_btn' onClick={() => setCheckoutModal(true)}>CHECKOUT</button>
            </>
          )}
        </div>
        {showModal && <Modal/>}
        {showCheckoutModal && <CheckoutModal/>}
        {showPaymentModal && <PaymentModal/>}
        {showManualModal && <ManualModal/>}
        {showPointsModal && <PointsModal/>}
        {showWeb3Modal && <Web3Modal/>}
      </>
    );
  } catch (error) {
    console.log(error)
    dispatch(deleteCart())
    window.location.reload();  
  }
  function PaymentModal(){
    return (
      <div className='modal_container'>
        <div className='modal_body'>
          <button className='modal_close' onClick={()=>setPaymentModal(false)}>X</button>
          <h3>Payment</h3>
      
          <button className='blue_btn' onClick={() => checkout('points')}>Checkout with points</button>
          <button className='blue_btn' onClick={() => checkout('web3')}>Checkout Crypto</button>
          <button className='blue_btn' onClick={() => checkout('manual')}>Checkout manual transfer</button>


        </div>
      </div>
    )
  }
  function CheckoutModal(){
    function checkoutFormSubmit(e){
      e.preventDefault();
      
      let name = e.target.name.value;
      let Address = e.target.Address.value;
      let Email = e.target.Email.value;
      let Extra_Details = e.target.Extra_Details.value;

      setuserAddress(userAddress => ({
        'name': name,
        'address': Address,
        'email': Email,
        'extra': Extra_Details,
      }));

      setCheckoutModal(false)
      setPaymentModal(true)
    }
    return (
      <div className='modal_container'>
        <div className='modal_body'>
          <button className='modal_close' onClick={()=>setCheckoutModal(false)}>X</button>
          <h3>Checkout</h3>
          <form onSubmit={checkoutFormSubmit}>
              
            <div key="name" className="individual_option">
                <label htmlFor="name">Name:</label>
                <input type='text' placeholder='Name' id="name" name="name" required/>
            </div>
            <div key="Address" className="individual_option">
                <label htmlFor="Address">Address:</label>
                <input type='text' placeholder='Address' id="Address" name="Address" required/>
            </div>
            <div key="Email" className="individual_option">
                <label htmlFor="Email">Email:</label>
                <input type='email' placeholder='Email' id="Email" name="Email" required/>
            </div>
            <div key="Extra_Details" className="individual_option">
                <label htmlFor="Extra_Details">Extra Details:</label>
                <input type='text' placeholder='Extra Details' id="Extra_Details" name="Extra_Details"/>
            </div>

            <button type='submit' className='blue_btn'>PAY</button>
          </form>
        </div>
      </div>
    )
  }


  function paymentFinalStep(data){
    let cartSimplified = [];

    cart.map((item)=>{
      cartSimplified.push(item.product.title+" "+
      Object.keys(item.options).map(data => {
        if(item.options[data]){
          return (data+": "+item.options[data])
        }
      })
      +" Quantity:"+item.quantity)
    })

    if(data.length > 39){
      let hash = data;
      sendMail(userAddress,cartSimplified,hash)
      finishOrderDeleteCart();
    }
    if(data === "points"){
      let total_amount = parseInt(cart.reduce((accumulator, item) => accumulator + item.quantity * item.product.price,0));
      let new_points = usersPoints - total_amount;
      try {
        const data = {
            wallet: global.account.toString(),
            new_points: new_points,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = '/api/modify_points'
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSONdata,
        }

        fetch(endpoint, options)
        .then((res) => res.json())
        .then((result) => {
          if(result.response == "failed" || result.response == "error"){
            console.log('Failed to modify, maybe wrong wallet address')
            return;
          }else{
            sendMail(userAddress,cartSimplified)
            finishOrderDeleteCart();
          }
        });
      } catch (error) {
          console.log('Error updating points')
          console.log(error)
      }
    }
  }


  function sendMail(userAddress,cartSimplified,hash){
    userAddress.cart = cartSimplified;
    if(hash){
      userAddress.hash = hash;
    }
    fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userAddress),
    })    
  }
  function finishOrderDeleteCart(){
    dispatch(deleteCart())
    window.location.replace('/thanks');
  }

  function triggerModal(text){
    setModalText(text)
    setShowModal(true)
  }

  function Modal(){
    return (
      <div className='modal_container'>
        <div className='modal_body'>
          <button className='modal_close' onClick={()=>setShowModal(false)}>X</button>
          {parse(modalText)}
        </div>
      </div>
    )
  }

};

export default CartPage;