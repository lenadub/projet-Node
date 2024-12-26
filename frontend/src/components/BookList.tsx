import classes from "../styles/BookList.module.css"
import BookCard from "./BookCard"

function BookList(props) {
  // console.log(`books: ${JSON.stringify(props)}`)
  return(
    <div className={classes.bookList}>
      {props.books.map((book) => {
        return <BookCard key={book.id} book={book} className={classes.bookItem} />
      })}
    </div>
  )
}

export default BookList
