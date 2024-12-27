import { useRef } from "react"

import classes from "../styles/SearchBar.module.css"

function SearchBar({onSearch}) {
  const searchBox = useRef()

  function searchBooks(searchTerm) {
    const url = `http://localhost:3000/books/search?title=${searchTerm}`

    fetch(url, {
      method: 'GET'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json()
    })
    .then(responseData => {
      onSearch(responseData)
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }

  async function clickHandler(evt) {
    const searchTerm = searchBox.current.value.trim().toLowerCase()

    if(searchTerm === "") {
      return []
    }

    searchBooks(searchTerm)
  }

  function keyUpHandler(evt) {
    if(evt.key === 'Enter') {
      const searchTerm = searchBox.current.value.trim().toLowerCase()
      searchBooks(searchTerm)
    }
  }

  return(
    <div className={classes.searchBar}>
      <label>Search:</label>
      <input className={classes.searchBox} type="text" onKeyUp={keyUpHandler}
             placeholder="please enter a book title" ref={searchBox} />
      <input className={classes.searchButton}
        onClick={clickHandler} type="button" value="Go!" />
    </div>
  )
}

export default SearchBar
