//
// MODULE TO HANDLE DATABSE QUERIES
//


// import psql pool
import pool from "./connect";

/////// USERS //////
// Creates a new user in the database with provided credentials
// Returns the newly created user's ID

interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}


async function createUser(username: string, password: string, email: string): Promise<{ id: number }> {
  const insert = `
    insert into users(username,password, email)
    values($1, $2, $3) RETURNING id
  `;
  const values = [username, password, email];
  let response = await pool.query(insert, values);

  // Return rows[0]. Should include user id if no error
  return response.rows[0];
}

// Retrieves user information by user ID
// Throws error if user is not found
async function findUser(userId: number): Promise<User> {
  const select = `
    select * from users where id=$1
  `;
  const values = [userId];
  const response = await pool.query(select, values);
  if (response.rows.length === 0) {
    throw new Error("User not found");
  }
  // Return rows[0]. Should include user data if no error
  return response.rows[0];
}

// Searches for a user by  username
// Throws error if user is not found
async function findUserbyName(userName: string): Promise<User> {
  const select = `
    select * from users where username=$1
  `;
  const values = [userName];
  const response = await pool.query(select, values);
  if (response.rows.length === 0) {
    throw new Error("User not found");
  }
  // Return rows[0]. Should include user data if no error
  return response.rows[0];
}

// Updates user's password in the database
// Throws error if user not found or update fails
async function updateUserPassword(userId: number, newPassword: string): Promise<void> {
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

  // Return rows[0]. Should include new user data if no error
  // Newpassword is inckuded (not very secure)
}

// Removes a user from the database by their ID
async function deleteUser(userId: number): Promise<void> {
  const deleteQuery = `
    delete from users where id=$1
  `;
  const values = [userId];
  await pool.query(deleteQuery, values);
}

/////// BOOKS //////
// Creates a new book entry with all book details
// Automatically sets creation and update timestamps
// Returns the book's reference number

interface Book {
  reference: number;
  title: string;
  author: string;
  editor: string;
  year: number;
  price: number;
  description: string;
  cover: string;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

async function createBook({
                            reference,
                            title,
                            author,
                            editor,
                            year,
                            price,
                            description,
                            cover,
                            stock,
                          }: {
  reference: number;
  title: string;
  author: string;
  editor: string;
  year: number;
  price: number;
  description: string;
  cover: string;
  stock: number;
}): Promise<{ number }> {
  const insert = `
    insert into books(reference, title, author, editor, year, price, description, cover, stock, created_at, updated_at)
    values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING reference
  `;
  const currentDate = new Date();
  const values = [reference, title, author, editor, year, price, description, cover, stock, currentDate, currentDate];
  let response = await pool.query(insert, values);

  // Return rows[0]. Should include book reference if no error
  return response.rows[0];
}

// Retrieves book information by reference number
async function findBook(bookRef: number): Promise<Book> {
  const select = `select * from books where books.reference='${bookRef}'`;
  const response = await pool.query(select);

  // Return rows[0]. Should include book data if no error
  return response.rows[0];
}

// Searches for books by title (case-insensitive partial match)
// Returns array of matching books
async function findBookByTitle(bookTitle: string): Promise<Book[]> {
  const select = `select * from books where LOWER(books.title) like LOWER('%${bookTitle}%')`;
  const response = await pool.query(select);
  // console.log(JSON.stringify(response.rows));

  // Return rows[0]. Should include book data if no error
  return response.rows;
}

// Removes a book from database by reference number
async function deleteBook(bookRef: number): Promise<void> {
  const deleteQuery = `
    delete from books where reference=$1
  `;
  const values = [bookRef];
  await pool.query(deleteQuery, values);
}

// Removes books from database matching partial title
async function deleteBookByTitle(bookTitle: string): Promise<void> {
  const deleteQuery = `
    delete from books where title like $1
  `;
  const values = [`%${bookTitle}%`];
  await pool.query(deleteQuery, values);
}

// Updates book information except reference number
// Updates the 'updated_at' timestamp
async function updateBook({
                            reference,
                            title,
                            author,
                            editor,
                            year,
                            price,
                            description,
                            cover,
                            stock,
                          }: {
  reference: number;
  title: string;
  author: string;
  editor: string;
  year: number;
  price: number;
  description: string;
  cover: string;
  stock: number;
}): Promise<void>{
  const updateQuery = `
    update books
    set title=$2, author=$3, editor=$4, year=$5, price=$6, description=$7, cover=$8, stock=$9, updated_at=$10
    where reference=$1
  `;
  const currentDate = new Date();
  const values = [reference, title, author, editor, year, price, description, cover, stock, currentDate];
  await pool.query(updateQuery, values);
}

// Decrements book stock by 1 if available
// Throws error if book is out of stock or not found
async function consumeBookStock(bookRef: number): Promise<void> {
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

// Increases book stock by specified amount
async function replenishBookStock(bookRef: number, amount: number): Promise<void> {
  const updateQuery = `
    update books
    set stock = stock + $2, updated_at = $3
    where reference = $1
  `;
  const currentDate = new Date();
  const values = [bookRef, amount, currentDate];
  await pool.query(updateQuery, values);
}

// Retrieves current stock level of a book
// Throws error if book not found
async function getBookStock(bookRef: number): Promise<number> {
  const select = `
    select stock from books where reference = $1
  `;
  const values = [bookRef];
  const response = await pool.query(select, values);
  if (response.rows.length === 0) {
    throw new Error("Book not found");
  }
  // Return rows[0]. Should include stock if no error
  return response.rows[0].stock;
}

// Retrieves all books from database
async function showBooks(): Promise<Book[]> {
  const select = `select * from books`;
  const response = await pool.query(select);

  // return all rows. Should include all books if no error
  return response.rows;
}

/////// ORDERS //////
// Creates new order for user with optional status
// Returns the created order details
interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: Date;
}

async function createOrder(userId: number, status: string = 'pending'): Promise<number> {
  const insert = `
    INSERT INTO orders (user_id,  status, created_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const values = [userId, status];
  const response = await pool.query(insert, values);

  // Should include order Id if no error
  return response.rows[0];
}

// Removes an order from database
async function deleteOrder(orderId: number): Promise<void> {
  const deleteQuery = `
    DELETE FROM orders WHERE id = $1
  `;
  const values = [orderId];
  await pool.query(deleteQuery, values);
}

// Retrieves all orders for a specific user
// Throws error if no orders found
async function findOrderByCustomer(userId: number): Promise<Order[]> {
  const select = `
    SELECT * FROM orders WHERE user_id = $1
  `;
  const values = [userId];
  const response = await pool.query(select, values);
  if (response.rowCount === 0) {
    throw new Error("Order not found");
  }

  // return all rows. Should include all orders if no error
  return response.rows;
}

// Retrieves specific order by ID
// Throws error if order not found
async function findOrderById(orderId: number): Promise<Order> {
  const select = `
    SELECT * FROM orders WHERE id = $1
  `;
  const values = [orderId];
  const response = await pool.query(select, values);
  if (response.rowCount === 0) {
    throw new Error("Order not found");
  }
  //  Should include order data if no error
  return response.rows[0];
}

// Updates order status and returns updated order
// Throws error if order not found or update fails
async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
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

/////// ORDER ITEMS //////
// Adds item to an existing order
// Returns the created order item details
interface OrderItem {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: number;
}

async function addOrderItem(orderId: number, bookId: number, quantity: number, price: number): Promise<OrderItem> {
  const insert = `
    INSERT INTO order_items (order_id, book_id, quantity, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [orderId, bookId, quantity, price];
  const response = await pool.query(insert, values);

  //  Should include order-item Id if no error
  return response.rows[0];
}

// Retrieves all items in a specific order
// Throws error if no items found
async function getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
  const select = `
    SELECT * FROM order_items WHERE order_id = $1
  `;
  const values = [orderId];
  const response = await pool.query(select, values);
  if (response.rowCount === 0) {
    throw new Error("Order Item not found");
  }

  //  Should include  all order-items Id for the order if no error
  return response.rows;
}

// Removes specific item from an order
async function deleteOrderItem(orderItemId: number): Promise<void> {
  const deleteQuery = `
    DELETE FROM order_items WHERE id = $1
  `;
  const values = [orderItemId];
  await pool.query(deleteQuery, values);
}

// Calculates total price of all items in an order
// Returns 0 if order has no items
async function computeOrderTotal(orderId: number): Promise<number> {
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
