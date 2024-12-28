//
// UNITARY TESTS MODULE
//

//
// This code is adapted from and inspired by the following sources:
// -  https://www.testim.io/blog/supertest-how-to-test-apis-like-a-pro/
// -  https://dev.to/franciscomendes10866/testing-express-api-with-jest-and-supertest-3gf
// -  https://mvryo.blogspot.com/2024/10/api-testing-with-jest-and-supertest.html
// -  https://github.com/achmadprayoogo/example-supertest-api-test-node-js
//

// Import the SuperTest library for HTTP testing
// The * import syntax used for compatibility with both ESM and CommonJS modules. 
// Here required for testing
import * as request from "supertest";

// Import Express to create the web server and handle HTTP requests
// The * import syntax used for compatibility with both ESM and CommonJS modules. 
// Here required for testing
import * as express from 'express';

import { router } from '../data/routes';
import pool from "../data/connect";

const app= express();


app.use(express.json());
app.use('/', router);

// console.log(router);

describe('API Routes', () => {
    ////////////////// ROOT ///////////////
    it('should return API status', async ():Promise<void> => {
     //   console.log(app);
      //  console.log(request);
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({status: 200, message: 'API server OK'});
    });
    ////////////////// USERS ///////////////
    it('should create a user', async ():Promise<void> => {
        const userData = { username: 'john_doe', email: 'john@example.com', password: 'password123' };
        const response = await request(app).post('/users').send(userData);
        expect(response.statusCode).toBe(201);
       //  expect(response.body).toHaveProperty('id');
       // expect(response.body.username).toBe(userData.username);
    });

    it('should fail to create a user with a duplicate username', async ():Promise<void> => {
        const userData = { username: 'john_doe', email: 'john@example.com', password: 'password123' };

        // Attempt to create the same user again
        const response = await request(app).post('/users').send(userData);
        expect(response.statusCode).toBe(500); // Expecting HTTP 500 Error
        expect(response.body).toHaveProperty('error'); // Make sure error is returned
        expect(response.body.error).toMatch(/clé dupliquée/i); // Match error message mentioning duplicate
    });


    it('should fail to create a user with missing required fields', async ():Promise<void> => {
        // Missing required fields: username and email
        const incompleteUserData = { password: 'password123' };

        const response = await request(app).post('/users').send(incompleteUserData);
        expect(response.statusCode).toBe(400); // Expecting HTTP 400 Error
        expect(response.body).toHaveProperty('error'); // Expect error is returned
        expect(response.body.error).toMatch(/missing/i); // Missing fields detected
    });


    it('should retrieve a user by name, then retrieve using ID, and finally delete by ID', async ():Promise<void> => {
        const userName = 'john_doe';

        // Step 1: Retrieve the user by name
        const retrieveByNameResponse = await request(app).get(`/users/name/${userName}`);
        expect(retrieveByNameResponse.statusCode).toBe(200);   // Expecting HTTP 200 
        expect(retrieveByNameResponse.body).toHaveProperty('id'); // ID exists in the response

        const userId = retrieveByNameResponse.body.id; // Get user ID from the response

        // Step 2: Retrieve the user by ID
        const retrieveByIdResponse = await request(app).get(`/users/${userId}`);
        expect(retrieveByIdResponse.statusCode).toBe(200); // Expecting HTTP 200
        expect(retrieveByIdResponse.body).toHaveProperty('id', userId); // ID match

        // Step 3: Delete the user by ID
        const deleteResponse = await request(app).delete(`/users/${userId}`);
        expect(deleteResponse.statusCode).toBe(200); // Expecting HTTP 200 
        expect(deleteResponse.body).toEqual({ message: 'User deleted successfully' });
    });

//     ////////////////// ORDERS ///////////////
    it('should create an order', async ():Promise<void> => {
        const orderData = { userId: 1, status: 'pending' };
        const response = await request(app).post('/orders').send(orderData);
        expect(response.statusCode).toBe(201); // Expecting HTTP 201
        expect(response.body).toHaveProperty('id'); // ID returned
    });

    it('should retrieve orders by user ID', async ():Promise<void> => {
        const userId = 1; // Ensure this user ID exists in your test database
        const response = await request(app).get(`/orders/user/${userId}`);
        expect(response.statusCode).toBe(200); // Expecting HTTP 200 
        expect(Array.isArray(response.body)).toBe(true); // Array of orders
    });

    it('should delete an order by ID', async ():Promise<void> => {
        const orderId = 1; // Ensure this order ID exists in your test database
        const response = await request(app).delete(`/orders/${orderId}`);
        expect(response.statusCode).toBe(200); // Expecting HTTP 200 
        expect(response.body).toEqual({ message: 'Order deleted successfully' });
    });

//     ////////////////// BOOKS ///////////////
    it('should create a book', async ():Promise<void> => {
        const bookData = {
            reference:13,
            title: 'Test Book',
            author: 'Test Author',
            editor: 'Test Editor',
            year: 2023,
            price: 15.99,
            description: 'A test book',
            cover: "/images/cover-12.jpg"
        };
        const response = await request(app).post('/books').send(bookData);
        expect(response.statusCode).toBe(201);
        // expect(response.body).toHaveProperty('reference');
        // expect(response.body.title).toBe(bookData.title);
    });

    it('should fail to create a book with missing required fields', async ():Promise<void> => {
        // Missing required fields: reference, cover, title and author
        const incompleteBookData = {
            editor: 'Test Editor',
            year: 2023,
            price: 15.99,
            description: 'A test book with missing title and author',
        };

        const response = await request(app).post('/books').send(incompleteBookData);
        expect(response.statusCode).toBe(400); // Expecting HTTP 400 Error
        expect(response.body).toHaveProperty('error'); // Error message is returned
        expect(response.body.error).toMatch(/missing/i); // missing fields
    });



    it('should retrieve a book by Title, then retrieve it using its Reference, and finally delete by Reference', async () => {
        // Retrieve the book by title
        const bookTitle = 'Test%20Book';
        const retrieveByTitleResponse = await request(app).get(`/books/search?title=${bookTitle}`);
        expect(retrieveByTitleResponse.statusCode).toBe(200);
        expect(Array.isArray(retrieveByTitleResponse.body)).toBe(true); // Expect array
        expect(retrieveByTitleResponse.body.length).toBeGreaterThan(0); // Expect at least one book is returned

        const book = retrieveByTitleResponse.body[0]; // Get the first book from the response array
        expect(book).toHaveProperty('reference'); //  Book has an Reference
        const bookRef = book.reference; // Get book Reference 

        // Retrieve the book by Reference
        const retrieveByReferenceResponse = await request(app).get(`/books/reference/${bookRef}`);
        expect(retrieveByReferenceResponse.statusCode).toBe(200); // Expecting HTTP 200 
        expect(retrieveByReferenceResponse.body).toHaveProperty('reference', bookRef); // Reference match

        // Delete the book by Reference
        const deleteResponse = await request(app).delete(`/books/${bookRef}`);
        expect(deleteResponse.statusCode).toBe(200); // Expecting HTTP 200 
        expect(deleteResponse.body).toEqual({ message: 'Book deleted successfully' });
    });


    it('should retrieve all books', async () :Promise<void>=> {
        const response = await request(app).get('/books');
        expect(response.statusCode).toBe(200); // Expecting HTTP 200 
        expect(Array.isArray(response.body)).toBe(true);
    });
 });
