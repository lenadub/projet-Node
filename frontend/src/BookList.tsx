import classes from "./BookList.module.css"

function BookList(props) {
  // console.log(`books: ${JSON.stringify(props)}`)
  return(
    <ul className={classes.bookList}>
      {props.books.map((book) => {
        return <li key={book.id} className={classes.bookItem}>{book.title}</li>
      })}
    </ul>
  )
}

export default BookList