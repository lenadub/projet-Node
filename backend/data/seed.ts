import { createUser, createBook } from "./queries"


// To avoid error for  Top-level await expressions
// we wrap this into an async function
(async () => {
    // Create some users
    await createUser("ldubois", "Adc", "lena.dubois@gmail.com");
    await createUser("sfarges", "1234", "sarah.farges@gmail.com");

    // Create some books
    await  createBook({
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "editor": "penguin classics",
        "year": 1878,
        "price": 12.90,
        "description": "A romance taking place in the 19th century",
        "cover": "/images/cover-1.jpg",
        "stock":5
      })
    
      await  createBook({
        "title": "The Phantom of the Opera",
        "author": "Gaston Leroux",
        "editor": "livre de poche",
        "year": 1909,
        "price": 10.50,
        "description": "A ghost story that's not really about ghosts",
        "cover": "/images/cover-2.jpg",
        "stock":3
      })
    
      await  createBook({
          "title": "The great Gatsby",
          "author": "F. Scott Fitzgerald",
          "editor": "penguin classics",
          "year": 1925,
          "price": 9.99,
          "description": "A story about living the American dream in the Roaring 20s with a touch of romance",
          "cover": "/images/cover-3.jpg",
          "stock":4
      })
    
    await  createBook({
        "title": "react key concepts",
        "author": "Maximilian Schwarzmüller",
        "editor": "packt",
        "year": 2022,
        "price": 40.90,
        "description": "A great book for an advanced introduction to React",
        "cover": "/images/cover-4.jpg",
        "stock":5
    })
    
    await  createBook({
        "title": "the road to react",
        "author": "Robin Wieruch",
        "editor": "leanpub",
        "year": 2023,
        "price": 38.50,
        "description": "A nice introduction to React",
        "cover": "/images/cover-5.jpg",
        "stock":6
    })
    
    await  createBook({
        "title": "eloquent javascript",
        "author": "Marijn Haverbeke",
        "editor": "no starch press",
        "year": 2018,
        "price": 32.90,
        "description": "A Creative Commons book about modern javascript",
        "cover": "/images/cover-6.jpg",
        "stock":5
    })
    
    await  createBook({
        "title": "ES6 for humans",
        "author": "Deepak Grober",
        "editor": "apress",
        "year": 2017,
        "price": 39.99,
        "description": "The latest standard of javascript: ES2015 and beyond",
        "cover": "/images/cover-7.jpg",
        "stock":4
    })
    
    await  createBook({
        "title": "The witcher the last wish",
        "author": "Andrzej Sapkowski",
        "editor": "bragelonne",
        "year": 1993,
        "price": 9.90,
        "description": "A thrilling fantasy story where Geralt has to find his destiny",
        "cover": "/images/cover-8.jpg",
        "stock":3
    })
    
    await  createBook({
        "title": "Six of crows",
        "author": "Leigh Bardugo",
        "editor": "bragelonne",
        "year": 2015,
        "price": 12.20,
        "description": "Follow the story of a band of thief, planning the most dangerous heist",
        "cover": "/images/cover-9.jpg",
        "stock":4
    })
    
    await  createBook({
        "title": "The book thief",
        "author": "Markus Zusak",
        "editor": "penguin classics",
        "year": 2005,
        "price": 10.89,
        "description": "A book about a girl during World War II in Nazi Germany",
        "cover": "/images/cover-10.jpg",
        "stock":5
    })
    
    await  createBook({
        "title": "The princess bride",
        "author": "William Goldman",
        "editor": "bragelonne",
        "year": 1973,
        "price": 9.90,
        "description": "Westley, who has become Roberts, embarks on a quest to save Buttercup but first must find out if she truly does love him",
        "cover": "/images/cover-11.jpg",
        "stock":6
    })

    await  createBook({
        "title": "Mastering Typescript",
        "author": "Nathan Rozentals",
        "editor": "Packt",
        "year": 2021,
        "price": 42.60,
        "description": "Build enterprise-ready, modular web applications using Typescript 4 and modern frameworks",
        "cover": "/images/cover-12.jpg",
        "stock":1
    })
})();
