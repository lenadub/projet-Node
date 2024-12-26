import React from "react";
import { useCart } from "./context/CartContext"; 
import classes from "./CartPage.module.css"

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart(); // Récupérez les données du panier via le contexte

  const handleRemove = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className={classes.cart}>
      <h1>Shopping Cart</h1>
      <div className={classes.cartItems}>
        {state.items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          state.items.map((item) => (
            <div key={item.id} className={classes.cartItem}>
              <span>{item.name}</span>
              <span>{item.price} $</span>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
      {state.items.length > 0 && (
        <div className={classes.cartTotal}>
          <h2>Total: {totalPrice} $</h2>
          <button className={classes.checkoutBtn}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;