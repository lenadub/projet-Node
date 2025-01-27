//
// MODULE TO CREATE TABLES IN DATABASE
//


import pool from "./connect"


// create table 'users'
const createUsers: string = `
    create table if not exists users(
                                        id SERIAL primary key,
                                        username TEXT not null unique,
                                        password TEXT not null,
                                        email TEXT not null
    )
`;

// create table 'books'
const createBooks: string = `
    create table if not exists books(
                                        reference INTEGER primary key,
                                        title TEXT not null,
                                        author TEXT not null,
                                        editor TEXT not null,
                                        year INTEGER not null,
                                        price REAL not null,
                                        description TEXT,
                                        cover TEXT,
                                        stock INTEGER not null default 0,
                                        created_at TIMESTAMP,
                                        updated_at TIMESTAMP
    )
`;


// create table book 'orders'
const createOrders: string = `
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

// // create table 'orderItems'
const createOrderItems: string = `
  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(reference),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL
)
`;

// create table shopping 'carts'
// normally one per user, if users are managed by the app, or only 1 cart if no users
//const createCarts = `
//  // to be defined
//`;

// // create table  PDF 'invoices'
// const createInvoices = `
//   // to be defined
// `;

// To avoid error for Top-level await expressions
// we wrap this into an async function
(async ():Promise<void> => {
    await pool.query(createUsers);
    await pool.query(createBooks);
    await pool.query(createOrders);
    await pool.query(createOrders);
    await pool.query(createOrderItems);
})();
