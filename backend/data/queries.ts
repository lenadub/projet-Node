import pool from "./connect";

async function createUser(username, email) {
  const insert = `
    insert into users(username, email)  values($1, $2)
  `;
  const values = [username, email];
  await pool.query(insert, values);  //TODO check for errors, example: username not unique
}

async function findUser(userId) {
  const select = `
    select * from users where id=$1
  `;
  const values = [userId];
  const response = await pool.query(select, values);
  if (response.rows.length === 0) {
    throw new Error("User not found");
  }
  return response.rows[0];
}

async function deleteUser(userId) {
  const deleteQuery = `
    delete from users where id=$1
  `;
  const values = [userId];
  await pool.query(deleteQuery, values);
}

// CRUD operations on a book + books list
async function createBook({title, author, editor, year, price, description, stock}) {
  const insert = `
    insert into books(title, author, editor, year, price, description, stock, created_at, updated_at)
    values($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  const currentDate = new Date();
  const values = [title, author, editor, year, price, description, stock, currentDate, currentDate];
  let books = await pool.query(insert, values);
  return books;
}

async function findBook(bookId) {
  const select = `select * from books where books.id='${bookId}'`;
  const response = await pool.query(select);
  return response.rows[0];
}

async function findBookByTitle(bookTitle) {
  console.log('execute');
  const select = `select * from books where books.title like '%${bookTitle}%'`;
  const response = await pool.query(select);
  console.log(JSON.stringify(response.rows));
  return response.rows;
}

async function deleteBook(bookId) {
  const deleteQuery = `
    delete from books where id=$1
  `;
  const values = [bookId];
  await pool.query(deleteQuery, values);
}

async function deleteBookByTitle(bookTitle) {
  const deleteQuery = `
    delete from books where title like $1
  `;
  const values = [`%${bookTitle}%`];
  await pool.query(deleteQuery, values);
}

async function updateBook({id, title, author, editor, year, price, description, stock}) {
  const updateQuery = `
    update books
    set title=$2, author=$3, editor=$4, year=$5, price=$6, description=$7, stock=$8, updated_at=$9
    where id=$1
  `;
  const currentDate = new Date();
  const values = [id, title, author, editor, year, price, description, stock, currentDate];
  await pool.query(updateQuery, values);
}

async function consumeBookStock(bookId) {
  const updateQuery = `
    update books
    set stock = stock - 1, updated_at = $2
    where id = $1 and stock > 0
  `;
  const currentDate = new Date();
  const values = [bookId, currentDate];
  const response = await pool.query(updateQuery, values);
  if (response.rowCount === 0) {
    throw new Error("Book out of stock or not found");
  }
}

async function replenishBookStock(bookId, amount) {
  const updateQuery = `
    update books
    set stock = stock + $2, updated_at = $3
    where id = $1
  `;
  const currentDate = new Date();
  const values = [bookId, amount, currentDate];
  await pool.query(updateQuery, values);
}

async function getBookStock(bookId) {
  const select = `
    select stock from books where id = $1
  `;
  const values = [bookId];
  const response = await pool.query(select, values);
  if (response.rows.length === 0) {
    throw new Error("Book not found");
  }
  return response.rows[0].stock;
}

async function showBooks() {
  const select = `select * from books`;
  const response = await pool.query(select);
  return response.rows;
}

export {
  createUser,
  findUser,
  deleteUser,
  createBook,
  findBook,
  deleteBook,
  deleteBookByTitle,
  updateBook,
  consumeBookStock,
  replenishBookStock,
  getBookStock,
  showBooks,
  findBookByTitle
};
