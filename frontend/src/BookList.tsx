import React from "react";
import classes from "./BookList.module.css";

interface Book {
  id: number;
  title: string;
  author: string;
  editor: string;
  year: number;
  price: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = (props) => {
  return (
    <ul className={classes.bookList}>
      {props.books.map((book) => (
        <li key={book.id} className={classes.bookItem}>
          {book.title}
        </li>
      ))}
    </ul>
  );
};

export default BookList;