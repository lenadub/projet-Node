import { useState, useEffect } from "react";
import classes from "../styles/CartPage.module.css";

interface Book {
  reference: number;
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

  const handlePlaceOrder = async () => {
    try {
      // Create an order
      const orderResponse = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1, // Replace with actual userId from authentication context or state
          status: "completed",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order. Please try again.");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.id;

      // Create order items for each item in the cart
      for (const book of cart) {
        await fetch("http://localhost:3000/order-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            bookId: book.reference,
            quantity: 1, // Assuming quantity is always 1 per item in the cart
            price: book.price,
          }),
        });
      }

      // Clear the cart from local storage and update the state
      localStorage.removeItem("cart");
      setCart([]);
      setOrderPlaced(true);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleRemoveItem = async (index: number) => {
    const bookToRemove = cart[index];
  
    // Remove the item from the cart state
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // Replenish stock by 1 using the new backend route
    try {
      const response = await fetch(`http://localhost:3000/books/replenish/${bookToRemove.reference}`, {
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
    return parseFloat(
        cart.reduce((total, book) => total + book.price, 0).toFixed(2)
    );
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


