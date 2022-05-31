import Image from "next/image"
import styles from "../styles/product.module.css"
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart.slice';



function changeActive(e){ 
    const elems = document.querySelectorAll(".product_images")
    console.log('trying')
    elems.forEach((item) => {
        item.classList.remove("active_image")
    })
    const images = document.querySelectorAll(".product_images")
    images[e].classList.add("active_image")
}

function formSubmit(event){

    event.preventDefault();
}

export default function Product_page({ product }) {
    const dispatch = useDispatch();

    return (
        
        <div className={styles.product_page}>
            <div className={styles.product_page_inner}>
                <div className={styles.product_page_left}>
                    {product.images.map(function(src, idx){
                        var classname = " ";
                        if(idx === 0){
                            classname = "active_image";
                        }
                        return (
                            <div key={idx} id={idx} className={styles.individual_product_image+" product_images "+classname} onClick={() => changeActive(idx)}>
                                {/* <h5>{idx}</h5> */}
                                <Image src={src} layout="fill" alt={"Product "+idx} />
                            </div>
                        )
                    })}
                </div>

                <div className={styles.product_page_right}>
                    <h3>{product.title}</h3>
                    <h5>USDT ${product.price}</h5>
                    <form onSubmit={formSubmit}>
                        <div className={styles.individual_option}>
                            <label htmlFor="color">COLOR:</label>
                            <select defaultValue={'DEFAULT'} id="color" name="color">
                                <option value="DEFAULT" disabled></option>
                                <option>option 1</option>
                                <option>option 2</option>
                            </select>
                        </div>
                        <div className={styles.individual_option}>
                            <label htmlFor="gender">GENDER:</label>
                            <select defaultValue={'DEFAULT'} id="gender" name="gender">
                                <option value="DEFAULT" disabled></option>
                                <option>option 1</option>
                                <option>option 2</option>
                            </select>
                        </div>
                        <div className={styles.individual_option}>
                            <label htmlFor="size">SHOE SIZE:</label>
                            <select defaultValue={'DEFAULT'} id="size" name="size">
                                <option value="DEFAULT" disabled></option>
                                <option>option 1</option>
                                <option>option 2</option>
                            </select>
                        </div>
                        {/* <div className={styles.individual_option}>
                            <label htmlFor="receipt">RECEIPT NUMBER:</label>
                            <select defaultValue={'DEFAULT'} id="receipt" name="receipt">
                                <option value="DEFAULT" disabled></option>
                                <option>option 1</option>
                                <option>option 2</option>
                            </select>
                        </div>
                        <div className={styles.individual_option}>
                            <label htmlFor="payment">PAYMENT MADE TO:</label>
                            <select defaultValue={'DEFAULT'} id="payment" name="payment">
                                <option value="DEFAULT" disabled></option>
                                <option>option 1</option>
                                <option>option 2</option>
                            </select>
                        </div> */}
                        <button
                            onClick={() => dispatch(addToCart(product))}
                            className={styles.white_btn}
                        >
                            ADD TO MY BAG
                        </button>
                        <button className={styles.blue_btn}>BUY NOW</button>

                    </form>
                </div>                
           </div>

        <div className={styles.product_page_text_container}>
            <p>{product.description}</p>
            <h4>HOW TO ORDER</h4>
            <p>Fill out the Drop down menu<br/>
            Select the NFT you want on the item <br/>
            Make payment to the Crypto Girl Wallet: 0x....3r5fwsdf <br/>
            Attach your TXN number in this form <br/> 
            A member from Crypto GIrl will reach out with a draft <br/> 
            Once approved, work begins on your item <br/>
            Please allow 4-6 weeks for all custom merchandise to be completed and shipped out from the time of the final confirmation of the design.
            <br/> <br/> 
            Please note, as these are HAND PAINTED pieces, no item is identical and there may be slight differences from the draft sketch and the final prodcuts. All sales are final with no refunds for this specific service.</p>
        </div>
           
        </div>
    )
}
