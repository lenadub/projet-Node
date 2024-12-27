import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import classes from "../styles/BookDetailsPage.module.css"

function BookDetailsPage() {
  const { reference } = useParams() 
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartStatus, setCartStatus] = useState(false);

  const navigate = useNavigate() // Initialize the navigate function

  const goBack = () => {
    navigate(-1) // Go back to the previous page
  }

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books/reference/${reference}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setBook(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails();
  }, [reference])

  const handleAddToCart = () => {
    if (book.stock <= 0) {
      alert("This book is out of stock.");
      return;
    }

    setCartStatus(true);
    setTimeout(() => {
      setCartStatus(false);
    }, 5000);

    // Get the current cart from local storage
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    // Add the book to the cart
    const updatedCart = [...cart, book];

    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={classes.bookDetails}>
      {/* Back Arrow Button */}
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
          <p><strong>Editor:</strong> {book.editor}</p>

          
          <button
            className={`${classes.addToCartButton} ${cartStatus ? classes.added : ""}`}
            disabled={book.stock <= 0 || cartStatus}
            onClick={handleAddToCart}
          >
            {cartStatus ? (
              <>
                ✅ Added to Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
          {cartStatus && (
            <p className={classes.cartMessage}>{book.title} was added to the cart!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetailsPage