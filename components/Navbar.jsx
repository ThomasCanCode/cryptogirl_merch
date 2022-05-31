import Link from 'next/link';
import { useSelector } from 'react-redux';
import styles from '../styles/Navbar.module.css';
const Navbar = () => {

  // Selecting cart from global state
  const cart = useSelector((state) => state.cart);

  // Getting the count of items
  const getItemsCount = () => {
    return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
  };

  return (
    <button className={styles.navbar}>
      <Link href="/cart" passHref>
        <p>Cart ({getItemsCount()})</p>
      </Link>
    </button>
  );
};

export default Navbar;