import { useState, useEffect } from "react";
import classes from "../styles/CartPage.module.css";

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Get the cart from local storage
    const savedCart = localStorage.getItem("cart");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    setCart(cartItems);
  }, []);

  const handlePlaceOrder = () => {
    // Clear the cart from local storage
    localStorage.removeItem("cart");
    setCart([]);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, book) => total + book.price, 0);
  };

  return (
    <div className={classes.cart}>
      <h2>Your Cart:</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          {cart.map((book, index) => (
            <div key={index} className={classes.cartItem}>
              <div className={classes.cartItemImage}>
                <img src={`http://localhost:3000${book.cover}`} alt={book.title} />
              </div>
              <div className={classes.cartItemDetails}>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
              </div>
              <div className={classes.cartItemPrice}>
                <p>{book.price} €</p>
              </div>
            </div>
          ))}
          <div className={classes.cartTotal}>
            <p>Total: {calculateTotalPrice()} €</p>
            <button className={classes.placeOrderButton} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;

