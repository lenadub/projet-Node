import classes from "../styles/BookCard.module.css"
import { Link } from "react-router-dom";


function BookCard(props) {
  const endpoint = "http://localhost:3000"
  return(
    <Link to={`/book/reference/${props.book.reference}`} className={classes.bookCard}>
      {/* Le lien dirige vers la page des détails */}
      <img
        className={classes.image}
        src={endpoint + props.book.cover}
        alt={props.book.title}
      />
      <p className={classes.title}>{props.book.title}</p>
      <p className={classes.item}>{props.book.author}</p>
      <p className={classes.item}>{props.book.year}</p>
      <p className={classes.item}>{props.book.price} €</p>
    </Link>
  )
}

export default BookCard
