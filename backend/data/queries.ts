import pool from "./connect.js"

async function createUser(username, email) {
  const insert = `
    insert into users(username, email)  values($1, $2)
  `
  const values = [username, email]
  await pool.query(insert, values)  //TODO check for errors, example: username not unique
}

async function findUser(userId) {}

// CRUD operations on a book + books list
async function createBook({title, author, editor, year, price, description}) {
  const insert = `
    insert into books(title, author, editor, year, price, description, created_at, updated_at)
    values($1, $2, $3, $4, $5, $6, $7, $8)
  `
  const currentDate = new Date()
  const values = [title, author, editor, year, price, description, currentDate, currentDate]
  let books = await pool.query(insert, values)
  return books
}

async function findBook(bookId) {
  const select = `select * from books where books.id='${bookId}'`
  const response = await pool.query(select)
  // console.log(`  Response: ${JSON.stringify(response)}`)
  return response.rows[0]
}

async function findBookByTitle(bookTitle) {
  console.log('execute')
  const select = `select * from books where books.title like '%${bookTitle}%'`
  const response = await pool.query(select)
  console.log(JSON.stringify(response.rows))
  return response.rows
}

async function deleteBook(bookId) {}

async function updateBook({title, author, editor, year, price, description}) {}

async function showBooks(page=1) {
  const select = `select * from books`
  const response = await pool.query(select)
  return response.rows
}

export {
  createUser,
  findUser,
  createBook,
  findBook,
  deleteBook,
  updateBook,
  showBooks,
  findBookByTitle
}