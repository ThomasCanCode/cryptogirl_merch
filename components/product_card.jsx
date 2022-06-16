import Image from "next/image"
import styles from "../styles/product.module.css"
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import parse from 'html-react-parser';
import Link from "next/link";



function changeActive(e){ 
    const elems = document.querySelectorAll(".product_images")
    elems.forEach((item) => {
        item.classList.remove("active_image")
    })
    const images = document.querySelectorAll(".product_images")
    images[e].classList.add("active_image")
}


export default function Product_page({ product }) {
    const dispatch = useDispatch();

    
function formSubmit(event){
    event.preventDefault();
    let options = {};
    let formData = {};

    let first = event.target[0]
    let second = event.target[1]
    let third = event.target[2]
    let fourth = event.target[3]

    Object.entries(event.target).map((element) => {
        let name = element[1].name;
        // console.log(element[1].name)
        if(typeof name === "undefined"){
            return;
        }else{
    
            if(element[1].name.length > 1){
                options = {...options, [name.replace('option_child ','')]:element[1].value}
            }
        }
    });
    // console.log(options)
    dispatch(addToCart({product,options}))

}
    
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
                                <Image src={src} layout="fill" alt={"Product "+idx} />
                            </div>
                        )
                    })}
                </div>

                <div className={styles.product_page_right}>
                    <h3>{product.title}</h3>
                    <h5>USDT ${product.price}</h5>
                    <form onSubmit={formSubmit}>
                        {Object.entries(product.options).map(([key,obj]) => {
                            let name = obj.name;
                            let name_hash = 'option_child '+obj.name;
                            let type = obj.type;
                            let placeholder = obj.placeholder;
                            let fields = obj.fields;
                            String.prototype.hashCode = function() {
                                var hash = 0;
                                for (var i = 0; i < this.length; i++) {
                                    var char = this.charCodeAt(i);
                                    hash = ((hash<<5)-hash)+char;
                                    hash = hash & hash; // Convert to 32bit integer
                                }
                                return hash;
                            }
                            if(type == "text"){
                                return (
                                    <div key={name_hash} className={styles.individual_option}>
                                        <label htmlFor={name_hash}>{name}:</label>
                                        <input placeholder={placeholder} id={name_hash} name={name_hash}/>
                                    </div>
                                )
                            }else{
                                return (
                                    <div key={name} id={name} className={styles.individual_option}>
                                        <label htmlFor={name}>{name}:</label>
                                        <select defaultValue={'DEFAULT'} id={'option_child'+name} name="color">
                                            {fields.map(function(data, idx){
                                                return (
                                                    <option value={data} key={data}>{data}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                )
                            }
                        })}
                        <button
                            type="submit"
                            className={styles.white_btn}
                        >
                            ADD TO MY BAG
                        </button>
                        <Link href="/cart" passHref><button className={styles.blue_btn}>BUY NOW</button></Link>

                    </form>
                </div>                
           </div>

            <div className={styles.product_page_text_container}>
                <p>{parse(product.description)}</p>
                <p>Please note, as these are HAND PAINTED pieces, no item is identical and there may be slight differences from the draft sketch and the final prodcuts. All sales are final with no refunds for this specific service.</p>
            </div>
           
        </div>
    )
}
