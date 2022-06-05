import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
// Importing actions from  cart.slice.js
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../redux/slices/cartSlice';
import styles from '../styles/CartPage.module.css';

const CartPage = () => {

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getTotalPrice = () => {
    return cart.reduce(
      (accumulator, item) => accumulator + item.quantity * item.product.price,
      0
    );
  };

  return (
    <div className={styles.container_shop}>
      {cart.length === 0 ? (
        <h1>Your Cart is Empty!</h1>
      ) : (
        <>
          <div className={styles.header}>
            <div>Image</div>
            <div>Product</div>
            <div>Options</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Actions</div>
            <div>Total Price</div>
          </div>
          {cart.map((item) => (
            <div className={styles.body} key={item} >
              <div className={styles.image} onClick={()=>{window.location.replace('/product/'+item.product)}}>
                <Image src={item.product.images[0]} height="90" width="65" alt="" />
              </div>
              {console.log(item.product)}
              <p onClick={()=>{window.location.replace('/product/'+item.product.product)}}>{item.product.title}</p>
              <p>{item.options.map((option )=> (
                option
                ))}</p>
              <p>$ {item.product.price}</p>
              <p>{item.quantity}</p>
              <div className={styles.buttons}>
                <button onClick={() => dispatch(incrementQuantity(item.product.id))}>
                  +
                </button>
                <button onClick={() => dispatch(decrementQuantity(item.product.id))}>
                  -
                </button>
                <button onClick={() => dispatch(removeFromCart(item.product.id))}>
                  x
                </button>
              </div>
              <p>$ {item.quantity * item.product.price}</p>
            </div>
          ))}
          <h2>Total: $ {getTotalPrice()}</h2>
        </>
      )}
    </div>
  );
};

export default CartPage;