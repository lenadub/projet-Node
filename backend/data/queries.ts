import pool from "./connect";

async function createUser(username, password, email) {
  const insert = `
    insert into users(username,password, email)  values($1, $2, $3) RETURNING id
  `;
  const values = [username, password, email];
  let response = await pool.query(insert, values);
  return response.rows[0];
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

async function findUserbyName(userName) {
  const select = `
    select * from users where username=$1
  `;
  const values = [userName];
  const response = await pool.query(select, values);
  if (response.rows.length === 0) {
    throw new Error("User not found");
  }
  return response.rows[0];
}


async function updateUserPassword(userId, newPassword) {
  const updateQuery = `
    update users
    set password = $2
    where id = $1
  `;
  const values = [userId, newPassword];
  const response = await pool.query(updateQuery, values);
  if (response.rowCount === 0) {
    throw new Error("User not found or password update failed");
  }
}


async function deleteUser(userId) {
  const deleteQuery = `
    delete from users where id=$1
  `;
  const values = [userId];
  await pool.query(deleteQuery, values);
}

// CRUD operations on a book + books list
async function createBook({reference, title, author, editor, year, price, description, stock}) {
  const insert = `
    insert into books(reference, title, author, editor, year, price, description, stock, created_at, updated_at)
    values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING reference
  `;
  const currentDate = new Date();
  const values = [reference, title, author, editor, year, price, description, stock, currentDate, currentDate];
  let response = await pool.query(insert, values);
  return response.rows[0];
}

async function findBook(bookRef) {
  const select = `select * from books where books.reference='${bookRef}'`;
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

async function deleteBook(bookRef) {
  const deleteQuery = `
    delete from books where reference=$1
  `;
  const values = [bookRef];
  await pool.query(deleteQuery, values);
}

async function deleteBookByTitle(bookTitle) {
  const deleteQuery = `
    delete from books where title like $1
  `;
  const values = [`%${bookTitle}%`];
  await pool.query(deleteQuery, values);
}

async function updateBook({reference, title, author, editor, year, price, description, stock}) {
  const updateQuery = `
    update books
    set title=$2, author=$3, editor=$4, year=$5, price=$6, description=$7, stock=$8, updated_at=$9
    where reference=$1
  `;
  const currentDate = new Date();
  const values = [reference, title, author, editor, year, price, description, stock, currentDate];
  await pool.query(updateQuery, values);
}

async function consumeBookStock(bookRef) {
  const updateQuery = `
    update books
    set stock = stock - 1, updated_at = $2
    where reference = $1 and stock > 0
  `;
  const currentDate = new Date();
  const values = [bookRef, currentDate];
  const response = await pool.query(updateQuery, values);
  if (response.rowCount === 0) {
    throw new Error("Book out of stock or not found");
  }
}

async function replenishBookStock(bookRef, amount) {
  const updateQuery = `
    update books
    set stock = stock + $2, updated_at = $3
    where reference = $1
  `;
  const currentDate = new Date();
  const values = [bookRef, amount, currentDate];
  await pool.query(updateQuery, values);
}

async function getBookStock(bookRef) {
  const select = `
    select stock from books where reference = $1
  `;
  const values = [bookRef];
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

// Orders Table Operations
async function createOrder(userId,status = 'pending') {
  const insert = `
    INSERT INTO orders (user_id,  status, created_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const values = [userId,  status];
  const response = await pool.query(insert, values);
  return response.rows[0];
}

async function deleteOrder(orderId) {
  const deleteQuery = `
    DELETE FROM orders WHERE id = $1
  `;
  const values = [orderId];
  await pool.query(deleteQuery, values);
}

async function findOrderByCustomer(userId) {
  const select = `
    SELECT * FROM orders WHERE user_id = $1
  `;
  const values = [userId];
  const response = await pool.query(select, values);
  return response.rows;
}

async function findOrderById(orderId) {
  const select = `
    SELECT * FROM orders WHERE id = $1
  `;
  const values = [orderId];
  const response = await pool.query(select, values);
  return response.rows[0];
}

async function updateOrderStatus(orderId, status) {
  const update = `
    UPDATE orders SET status = $2 WHERE id = $1
    RETURNING *
  `;
  const values = [orderId, status];
  const response = await pool.query(update, values);
  if (response.rowCount === 0) {
    throw new Error("Order not found or update failed");
  }
  return response.rows[0];
}

// Order Items Table Operations
async function addOrderItem(orderId, bookId, quantity, price) {
  const insert = `
    INSERT INTO order_items (order_id, book_id, quantity, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [orderId, bookId, quantity, price];
  const response = await pool.query(insert, values);
  return response.rows[0];
}

async function getOrderItemsByOrderId(orderId) {
  const select = `
    SELECT * FROM order_items WHERE order_id = $1
  `;
  const values = [orderId];
  const response = await pool.query(select, values);
  return response.rows;
}

async function deleteOrderItem(orderItemId) {
  const deleteQuery = `
    DELETE FROM order_items WHERE id = $1
  `;
  const values = [orderItemId];
  await pool.query(deleteQuery, values);
}

async function computeOrderTotal(orderId) {
  const query = `
        SELECT SUM(quantity * price) AS total_price
        FROM order_items
        WHERE order_id = $1;
    `;
  const values = [orderId];

  try {
    const result = await pool.query(query, values);
    const totalPrice = result.rows[0].total_price;
    return totalPrice || 0; // Return 0 if no items are found
  } catch (error) {
    console.error('Error computing order total:', error.message);
    throw new Error('Unable to compute order total');
  }
}


export {
  createUser,
  findUser,
  findUserbyName,
  updateUserPassword,
  deleteUser,
  createBook,
  findBook,
  findBookByTitle,
  deleteBook,
  deleteBookByTitle,
  updateBook,
  consumeBookStock,
  replenishBookStock,
  getBookStock,
  showBooks,
  createOrder,
  deleteOrder,
  findOrderByCustomer,
  findOrderById,
  updateOrderStatus,
  addOrderItem,
  getOrderItemsByOrderId,
  deleteOrderItem,
  computeOrderTotal
};
