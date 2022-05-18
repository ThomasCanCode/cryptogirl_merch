import {ethers} from 'ethers';
import React, { useEffect } from "react";

export default function SignerPage(){


      async function sendTransaction(){
          
        let private_key = "7f29b8e181fe0441cf6718e4925370a33d79073f042999fbe67136a3f63e4f8c"
        let send_token_amount = "0.1"
        let to_address = "0x5686bC2b30ee6078Df8E7727c08aEBE96aeA519A"
        let send_address = "0xC8DCfB261aD7AfC35b875134D35B83dc7a4DAE05"
        let gas_limit = "0x100000"
        let wallet = new ethers.Wallet(private_key)
        window.ethersProvider = new ethers.providers.InfuraProvider("ropsten")

        try {
            send_token(
                send_token_amount,
                to_address,
                send_address,
                private_key
            )
        } catch (error) {
            alert(error)
        }
        function send_token(
            send_token_amount,
            to_address,
            send_account,
            private_key
          ) {
            let wallet = new ethers.Wallet(private_key)
            let walletSigner = wallet.connect(window.ethersProvider)
          
            window.ethersProvider.getGasPrice().then((currentGasPrice) => {
              let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
              console.log(`gas_price: ${gas_price}`)
          

            const tx = {
                from: send_account,
                to: to_address,
                value: ethers.utils.parseEther(send_token_amount),
                nonce: window.ethersProvider.getTransactionCount(
                send_account,
                "latest"
                ),
                gasLimit: ethers.utils.hexlify(gas_limit), // 100000
                gasPrice: gas_price,
            }
            console.dir(tx)
            try {
                walletSigner.sendTransaction(tx).then((transaction) => {
                console.dir(transaction)
                alert("Send finished!")
                })
            } catch (error) {
                alert("failed to send!!")
            }
            })
          }
      }


    return (
        <>
            <h2>Welcome</h2>
            <button onClick={() => {sendTransaction()}}>sendTransaction</button>
        </>
    )
}