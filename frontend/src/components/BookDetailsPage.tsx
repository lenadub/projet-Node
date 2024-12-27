import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from "../styles/BookDetailsPage.module.css";

function BookDetailsPage() {
  const { reference } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartStatus, setCartStatus] = useState(false); // Shows "Added to Cart"
  const [outOfStock, setOutOfStock] = useState(false); // Indicates "Out of Stock" state
  const [buttonDisabled, setButtonDisabled] = useState(false); // Controls button disable after stock runs out

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books/reference/${reference}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [reference]);

  const handleAddToCart = async () => {
    if (book.stock <= 0) {
      setOutOfStock(true); // Set out of stock state if no stock
      return;
    }

    try {
      // Decrement stock
      const response = await fetch(`http://localhost:3000/books/stock/${book.reference}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error updating stock. Please try again.');
      }

      // Update the stock in the frontend immediately
      setBook((prevBook) => ({
        ...prevBook,
        stock: prevBook.stock - 1, // Decrease stock by 1
      }));

      // Show "Added to Cart" message for 5 seconds
      setCartStatus(true);
      setTimeout(() => {
        setCartStatus(false); // Reset the cart status after 5 seconds
      }, 5000);

      // After 5 seconds, check if stock is 0
      setTimeout(() => {
        if (book.stock - 1 <= 0) {
          setOutOfStock(true); // Set out of stock state to true if stock is 0
          setButtonDisabled(true); // Disable button if out of stock
        }
      }, 5000);

      // Update the cart in local storage
      const savedCart = localStorage.getItem("cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];
      const updatedCart = [...cart, book];
      localStorage.setItem("cart", JSON.stringify(updatedCart));

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={classes.bookDetails}>
      <button className={classes.backButton} onClick={goBack}>
        ← Back
      </button>

      <div className={classes.coverSection}>
        <img
          className={classes.coverImage}
          src={`http://localhost:3000${book.cover}`}
          alt={book.title}
        />
      </div>
      <div className={classes.detailsSection}>
        <h1 className={classes.title}>{book.title}</h1>
        <div className={classes.priceAndEditor}>
          <p><strong>Summary:</strong> {book.description}</p>
          <p><strong>Price:</strong> {book.price} €</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Publishing date:</strong> {book.year}</p>
          <p><strong>Editor:</strong> {book.editor}</p>
          <p><strong>Stock:</strong> {book.stock}</p>

          <button
            className={`${classes.addToCartButton} ${cartStatus ? classes.added : ""} ${outOfStock ? classes.outOfStock : ""}`}
            onClick={handleAddToCart}
            disabled={buttonDisabled} // Disable the button if out of stock
          >
            {cartStatus ? (
              <>
                ✅ Added to Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </button>

          {outOfStock && !cartStatus && (
            <p className={classes.outOfStockMessage}>Sorry, this book is currently out of stock.</p>
          )}

          {cartStatus && (
            <p className={classes.cartMessage}>{book.title} was added to the cart!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;

