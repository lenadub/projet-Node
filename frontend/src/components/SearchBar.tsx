// import { useRef } from "react"

// import classes from "../styles/SearchBar.module.css"

// function SearchBar({onSearch}) {
//   const searchBox = useRef()

//   function searchBooks(searchTerm) {
//     const url = `http://localhost:3000/books/search?title=${searchTerm}`

//     fetch(url, {
//       method: 'GET'
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json()
//     })
//     .then(responseData => {
//       onSearch(responseData)
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     })
//   }

//   async function clickHandler(evt) {
//     const searchTerm = searchBox.current.value.trim().toLowerCase()

//     if(searchTerm === "") {
//       return []
//     }

//     searchBooks(searchTerm)
//   }

//   function keyUpHandler(evt) {
//     if(evt.key === 'Enter') {
//       const searchTerm = searchBox.current.value.trim().toLowerCase()
//       searchBooks(searchTerm)
//     }
//   }

//   return(
//     <div className={classes.searchBar}>
//       <label>Search:</label>
//       <input className={classes.searchBox} type="text" onKeyUp={keyUpHandler}
//              placeholder="please enter a book title" ref={searchBox} />
//       <input className={classes.searchButton}
//         onClick={clickHandler} type="button" value="Go!" />
//     </div>
//   )
// }

// export default SearchBar

import { useRef, useState, KeyboardEvent } from "react";
import classes from "../styles/SearchBar.module.css";

// Define the Book type for the suggestion list
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
}

interface SearchBarProps {
  onSearch: (books: Book[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const searchBox = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<Book[]>([]); // State to hold the list of suggestions
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false); // State to toggle dropdown visibility

  // Fetch books based on the search term
  const searchBooks = (searchTerm: string) => {
    const url = `http://localhost:3000/books/search?title=${searchTerm}`;

    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData: Book[]) => {
        setSuggestions(responseData); // Set suggestions based on search response
        setDropdownVisible(true); // Show the dropdown when there are suggestions
      })
      .catch((error) => {
        console.error("Error:", error);
        setSuggestions([]); // Clear suggestions if an error occurs
      });
  };

  // Handle click event for search (button)
  const clickHandler = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    const searchTerm = searchBox.current?.value.trim().toLowerCase() || "";

    if (searchTerm === "") {
      setSuggestions([]); // Clear suggestions if input is empty
      onSearch([]); // Pass empty results to the parent component
      return;
    }

    searchBooks(searchTerm); // Call the search function
    onSearch(suggestions); // Pass the search results to the parent component
  };

  // Handle key-up events (for real-time search suggestions)
  const keyUpHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = evt.target.value.trim().toLowerCase();

    if (searchTerm === "") {
      setSuggestions([]); // Clear suggestions if input is empty
      setDropdownVisible(false); // Hide dropdown
      return;
    }

    searchBooks(searchTerm); // Call the search function to fetch suggestions
  };

  // Handle Enter key for final search
  const handleEnterKey = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      const searchTerm = searchBox.current?.value.trim().toLowerCase() || "";
      if (searchTerm) {
        searchBooks(searchTerm); // Trigger search when Enter is pressed
        onSearch(suggestions); // Pass the search results to the parent component
      }
    }
  };

  // Handle selection of a suggestion from the dropdown
  const handleSuggestionClick = (suggestion: Book) => {
    if (searchBox.current) {
      searchBox.current.value = suggestion.title; // Fill the search box with the selected title
    }
    onSearch([suggestion]); // Pass the selected book to the parent component
    setSuggestions([]); // Clear suggestions after selection
    setDropdownVisible(false); // Hide dropdown after selection
  };

  // Handle mouse leave event to hide the dropdown
  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <div className={classes.searchBar} onMouseLeave={handleMouseLeave}>
      <label>Search:</label>
      <input
        className={classes.searchBox}
        type="text"
        onKeyUp={keyUpHandler}
        onKeyDown={handleEnterKey} // Listen for Enter key press
        placeholder="Please enter a book title"
        ref={searchBox}
      />
      {isDropdownVisible && suggestions.length > 0 && (
        <div className={classes.suggestionsDropdown}>
          {suggestions.map((book) => (
            <div
              key={book.id} // Assuming each book has a unique id
              className={classes.suggestionItem}
              onClick={() => handleSuggestionClick(book)}
            >
              {book.title}
            </div>
          ))}
        </div>
      )}
      <input
        className={classes.searchButton}
        onClick={clickHandler}
        type="button"
        value="Go!"
      />
    </div>
  );
};

export default SearchBar;
