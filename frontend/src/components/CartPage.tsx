import { useState, useEffect } from "react";
import classes from "../styles/CartPage.module.css";

interface Book {
  title: string;
  author: string;
  price: number;
  cover: string;
}

function CartPage() {
  const [cart, setCart] = useState<Book[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false); // State to track if the order is placed

  useEffect(() => {
    // Get the cart from local storage
    const savedCart = localStorage.getItem("cart");
    const cartItems: Book[] = savedCart ? JSON.parse(savedCart) : [];
    setCart(cartItems);
  }, []);

  const handlePlaceOrder = () => {
    // Clear the cart from local storage
    localStorage.removeItem("cart");
    setCart([]);
    setOrderPlaced(true); // Set orderPlaced to true when order is confirmed
  };

  const handleRemoveItem = async (index: number) => {
    const bookToRemove = cart[index];
  
    // Remove the item from the cart state
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // Replenish stock by 1 using the new backend route
    try {
      const response = await fetch(`http://localhost:3000/books/stock/replenish/${bookToRemove.reference}`, {
        method: 'PUT', // PUT request to replenish stock
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1 }), // Send amount 1 to replenish the stock
      });
  
      if (!response.ok) {
        throw new Error('Error replenishing stock. Please try again.');
      }
  
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  

  const calculateTotalPrice = () => {
    return cart.reduce((total, book) => total + book.price, 0);
  };

  return (
    <div className={classes.cart}>
      <h2>Your Cart:</h2>
      {orderPlaced ? (
        // Display confirmation message when order is placed
        <div className={classes.orderConfirmation}>
          <span className={classes.checkMark}>✔</span>
          <p>Order Confirmed!</p>
        </div>
      ) : (
        <div>
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
                    <button
                      className={classes.removeButton}
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </button>
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
      )}
    </div>
  );
}

export default CartPage;


