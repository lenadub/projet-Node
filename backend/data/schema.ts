import pool from "./connect"

// create table 'users'
const createUsers = `
    create table if not exists users(
                                        id SERIAL primary key,
                                        username TEXT not null unique,
                                        email TEXT not null
    )
`

// create table 'books'
const createBooks = `
    create table if not exists books(
                                        id SERIAL primary key,
                                        title TEXT not null,
                                        author TEXT not null,
                                        editor TEXT not null,
                                        year INTEGER not null,
                                        price REAL not null,
                                        description TEXT,
                                        stock INTEGER not null default 0,
                                        created_at TIMESTAMP,
                                        updated_at TIMESTAMP
    )
`;
// create table shopping 'carts'
// normally one per user, if users are managed by the app, or only 1 cart if no users
const createCarts = `
  // to be defined
`

// create table book 'orders'
const createOrders = `
  // to be defined
`

// create table 'orderItems'
const createOrderItems = `
  // to be defined
`

// create table  PDF 'invoices'
const createInvoices = `
  // to be defined
`;

// To avoid error for  Top-level await expressions
// we wrap this into an async function
(async () => {
    await pool.query(createUsers);
    await pool.query(createBooks);
    await pool.end();
})();