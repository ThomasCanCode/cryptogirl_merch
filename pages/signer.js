import {ethers} from 'ethers';

export async function signTransaction(){
    var signer = await new ethers.Wallet(process.env.PRIVATE_KEY);
    var test = signer.signMessage('test')
    console.log(signer)
    console.log(test)

    var signed = Promise.resolve(test).then(async (result)=>{
        var decode_message = await ethers.utils.verifyMessage('test',result)
        console.log(decode_message)
    })

}
export default function SignerPage(){
    return (
        <>
            <h2>Welcome</h2>
            <button onClick={() => {signTransaction()}}>Sign</button>
        </>
    )
}