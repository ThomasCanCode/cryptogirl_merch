import ThomasHeader from "../components/ThomasHeader"
import styles from '../styles/CartPage.module.css';

export default function Thanks(){
    return (
        <>
        <div className={styles.ThomasHeader}><ThomasHeader/> </div>   
            <div className={styles.container_shop}>
                <h1 className="pragmatica">Thank you for your order!</h1>
            </div>
        </>
    )
}