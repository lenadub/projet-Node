import classes from "../styles/HomePage.module.css"
import { useState, useEffect } from "react"

import SearchBar from "./SearchBar"
import BookList from "./BookList"

function HomePage() {
  const [books, setBooks] = useState([])

  function fetchBooks() {
    const url = 'http://localhost:3000/books'

    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json()
    })
    .then(responseData => {
      // console.log(`Received data: ${JSON.stringify(responseData)}`)
      setBooks(responseData)
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return(
    <div className={classes.home}>
      <SearchBar onSearch={setBooks} />
      <BookList books={books}/>
    </div>
  )
}

export default HomePage
