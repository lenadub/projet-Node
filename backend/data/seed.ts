import { createUser, createBook } from "./queries.js"

// create some users
await createUser("mickaël", "mickael.jackson@gmail.com")
await createUser("sfarges", "sarah.farges@gmail.com")

// create some books

await  createBook({
  "title": "Pride and Prejudice",
  "author": "Jane Austen",
  "editor": "penguin classics",
  "year": 1878,
  "price": 12.90,
  "description": "A romance taking place in the 19th century"
})

await  createBook({
  "title": "The Phantom of the Opera",
  "author": "Gaston Leroux",
  "editor": "livre de poche",
  "year": 1909,
  "price": 10.50,
  "description": "A ghost story that's not really about ghosts"
})

await  createBook({
    "title": "The great Gatsby",
    "author": "F. Scott Fitzgerald",
    "editor": "penguin classics",
    "year": 1925,
    "price": 9.99,
    "description": "A story about living the American dream in the Roaring 20s with a touch of romance"
})

await  createBook({
  "title": "react key concepts",
  "author": "Maximilian Schwarzmüller",
  "editor": "packt",
  "year": 2022,
  "price": 40.90,
  "description": "A great book for an advanced introduction to React"
}) 

await  createBook({
    "title": "the road to react",
    "author": "Robin Wieruch",
    "editor": "leanpub",
    "year": 2023,
    "price": 38.50,
    "description": "A nice introduction to React"
})

await  createBook({
    "title": "eloquent javascript",
    "author": "Marijn Haverbeke",
    "editor": "no starch press",
    "year": 2018,
    "price": 32.90,
    "description": "A Creative Commons book about modern javascript"
})

await  createBook({
    "title": "ES6 for humans",
    "author": "Deepak Grober",
    "editor": "apress",
    "year": 2017,
    "price": 39.99,
    "description": "The latest standard of javascript: ES2015 and beyond"
})