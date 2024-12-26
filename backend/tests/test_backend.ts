import * as request from "supertest";
import * as express from 'express';
import { router } from '../data/routes';
import pool from "../data/connect";

const app= express();
app.use(express.json());
app.use('/', router);

// console.log(router);

describe('API Routes', () => {
    ////////////////// ROOT ///////////////
    it('should return API status', async () => {
     //   console.log(app);
      //  console.log(request);
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({status: 200, message: 'API server OK'});
    });
    ////////////////// USERS ///////////////
    it('should create a user', async () => {
        const userData = { username: 'john_doe', email: 'john@example.com', password: 'password123' };
        const response = await request(app).post('/users').send(userData);
        expect(response.statusCode).toBe(201);
       //  expect(response.body).toHaveProperty('id');
       // expect(response.body.username).toBe(userData.username);
    });

    it('should fail to create a user with a duplicate username', async () => {
        const userData = { username: 'john_doe', email: 'john@example.com', password: 'password123' };

        // Attempt to create the same user again
        const response = await request(app).post('/users').send(userData);
        expect(response.statusCode).toBe(500); // Expecting HTTP 400 Bad Request
        expect(response.body).toHaveProperty('error'); // Ensure an error message is returned
        expect(response.body.error).toMatch(/clé dupliquée/i); // Match error message mentioning duplicate
    });


    it('should fail to create a user with missing required fields', async () => {
        // Missing required fields: username and email
        const incompleteUserData = { password: 'password123' };

        const response = await request(app).post('/users').send(incompleteUserData);
        expect(response.statusCode).toBe(400); // Expecting HTTP 400 Bad Request
        expect(response.body).toHaveProperty('error'); // Ensure an error message is returned
        expect(response.body.error).toMatch(/missing/i); // Match an error message indicating missing fields
    });


    it('should retrieve a user by name, then retrieve using ID, and finally delete by ID', async () => {
        const userName = 'john_doe';

        // Step 1: Retrieve the user by name
        const retrieveByNameResponse = await request(app).get(`/users/name/${userName}`);
        expect(retrieveByNameResponse.statusCode).toBe(200);
        expect(retrieveByNameResponse.body).toHaveProperty('id'); // Ensure ID exists in the response

        const userId = retrieveByNameResponse.body.id; // Extract user ID from the response

        // Step 2: Retrieve the user by ID
        const retrieveByIdResponse = await request(app).get(`/users/${userId}`);
        expect(retrieveByIdResponse.statusCode).toBe(200);
        expect(retrieveByIdResponse.body).toHaveProperty('id', userId); // Ensure the ID matches

        // Step 3: Delete the user by ID
        const deleteResponse = await request(app).delete(`/users/${userId}`);
        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body).toEqual({ message: 'User deleted successfully' });
    });

//     ////////////////// ORDERS ///////////////
    it('should create an order', async () => {
        const orderData = { userId: 1, status: 'pending' };
        const response = await request(app).post('/orders').send(orderData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should retrieve orders by user ID', async () => {
        const userId = 1; // Ensure this user ID exists in your test database
        const response = await request(app).get(`/orders/user/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should delete an order by ID', async () => {
        const orderId = 1; // Ensure this order ID exists in your test database
        const response = await request(app).delete(`/orders/${orderId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Order deleted successfully' });
    });

//     ////////////////// BOOKS ///////////////
    it('should create a book', async () => {
        const bookData = {
            reference:8,
            title: 'Test Book',
            author: 'Test Author',
            editor: 'Test Editor',
            year: 2023,
            price: 15.99,
            description: 'A test book',
        };
        const response = await request(app).post('/books').send(bookData);
        expect(response.statusCode).toBe(201);
        // expect(response.body).toHaveProperty('reference');
        // expect(response.body.title).toBe(bookData.title);
    });

    it('should fail to create a book with missing required fields', async () => {
        // Missing required fields: reference, title and author
        const incompleteBookData = {
            editor: 'Test Editor',
            year: 2023,
            price: 15.99,
            description: 'A test book with missing title and author',
        };

        const response = await request(app).post('/books').send(incompleteBookData);
        expect(response.statusCode).toBe(400); // Expecting HTTP 400 Bad Request
        expect(response.body).toHaveProperty('error'); // Ensure an error message is returned
        expect(response.body.error).toMatch(/missing/i); // Match an error message indicating missing fields
    });



    it('should retrieve a book by Title, then retrieve it using its Reference, and finally delete by Reference', async () => {
        // Retrieve the book by title
        const bookTitle = 'Test%20Book';
        const retrieveByTitleResponse = await request(app).get(`/books/search?title=${bookTitle}`);
        expect(retrieveByTitleResponse.statusCode).toBe(200);
        expect(Array.isArray(retrieveByTitleResponse.body)).toBe(true); // Ensure the response is an array
        expect(retrieveByTitleResponse.body.length).toBeGreaterThan(0); // Ensure at least one book is returned

        const book = retrieveByTitleResponse.body[0]; // Get the first book from the response array
        expect(book).toHaveProperty('reference'); // Ensure the book has an Reference
        const bookRef = book.reference; // Extract the book Reference from the object

        // Retrieve the book by Reference
        const retrieveByReferenceResponse = await request(app).get(`/books/reference/${bookRef}`);
        expect(retrieveByReferenceResponse.statusCode).toBe(200);
        expect(retrieveByReferenceResponse.body).toHaveProperty('reference', bookRef); // Ensure the References match

        // Delete the book by Reference
        const deleteResponse = await request(app).delete(`/books/${bookRef}`);
        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body).toEqual({ message: 'Book deleted successfully' });
    });


    it('should retrieve all books', async () => {
        const response = await request(app).get('/books');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
 });
