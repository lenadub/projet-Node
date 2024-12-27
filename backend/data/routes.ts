// Had to amend the import for the unitary tests to work
// for more detail, see : https://stackoverflow.com/questions/71055340/getting-undefined-import-of-postgres-in-jest
// previous import was : import express from 'express';
import * as express from 'express';

import {
    createUser,
    findUser,
    findUserbyName,
    createBook,
    findBook,
    deleteBook,
    deleteBookByTitle,
    updateBook,
    showBooks,
    findBookByTitle,
    replenishBookStock,
    consumeBookStock,
    getBookStock,
    deleteUser,
    updateUserPassword,
    deleteOrderItem,
    getOrderItemsByOrderId,
    addOrderItem,
    updateOrderStatus,
    findOrderById,
    findOrderByCustomer,
    deleteOrder,
    createOrder, computeOrderTotal
} from "./queries";

export const router = express.Router();

////////////////// ROOT ///////////////
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check API status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API server is OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.get('/', async (req, res) => {
    res.status(200);
    res.json({ "status": 200, "message": "API server OK" });
});

////////////////// ORDERS ///////////////

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user placing the order
 *               status:
 *                 type: string
 *                 description: The status of the order (default is 'pending')
 *             required:
 *               - userId
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       500:
 *        description: Cannot create Order
 */
router.post('/orders', async (req, res) => {
    const { userId,  status } = req.body;
    try {
        const order = await createOrder(userId, status);
        res.status(201);
        res.json(order);
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       500:
 *         description: Cannot delete Order
 */
router.delete('/orders/:id', async (req, res) => {
    const orderId = parseInt(req.params.id);
    try {
        await deleteOrder(orderId);
        res.status(200);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Find orders for a given customer
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer whose orders are being retrieved
 *     responses:
 *       200:
 *         description: List of orders for the specified customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found
 */
router.get('/orders/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const orders = await findOrderByCustomer(userId);
        res.status(200);
        res.json(orders);
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Find an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: The order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found
 */


router.get('/orders/:id', async (req, res) => {
    const orderId = parseInt(req.params.id);
    try {
        const order = await findOrderById(orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status for the order
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: The updated order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Order not found or update failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found or update failed
 */
router.put('/orders/:id/status', async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    try {
        const order = await updateOrderStatus(orderId, status);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


/**
 * @swagger
 * /orders/{id}/total:
 *   get:
 *     summary: Get the total cost of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to compute the total cost for
 *     responses:
 *       200:
 *         description: Total cost of the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                 total:
 *                   type: number
 *                   description: The total cost of the order
 *       404:
 *         description: Unable to compute order total
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unable to compute order total
 */
router.get('/orders/:id/total', async (req, res) => {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    try {
        const total = await computeOrderTotal(orderId);
        res.status(200).json({ orderId, total });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


////////////////// ORDER ITEMS ///////////////
/**
 * @swagger
 * /order-items:
 *   post:
 *     summary: Add an order item
 *     tags: [Order Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *                 description: The ID of the order
 *               bookId:
 *                 type: integer
 *                 description: The ID of the book
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the book in the order
 *               price:
 *                 type: number
 *                 description: The price of the book
 *             required:
 *               - orderId
 *               - bookId
 *               - quantity
 *               - price
 *     responses:
 *       201:
 *         description: Order item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 order_id:
 *                   type: integer
 *                 book_id:
 *                   type: integer
 *                 quantity:
 *                   type: integer
 *                 price:
 *                   type: number
 *       500:
 *          description: Cannot create Order Item
 */
router.post('/order-items', async (req, res) => {
    const { orderId, bookId, quantity, price } = req.body;
    try {
        const orderItem = await addOrderItem(orderId, bookId, quantity, price);
        res.status(201);
        res.json(orderItem);
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /order-items/order/{orderId}:
 *   get:
 *     summary: Get all order items by order ID
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: List of order items for the specified order ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   order_id:
 *                     type: integer
 *                   book_id:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: number
 *     404:
 *         description: Order Item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order Item not found
 */

router.get('/order-items/order/:orderId', async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    try {
        const items = await getOrderItemsByOrderId(orderId);
        res.status(200);
        res.json(items);
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /order-items/{id}:
 *   delete:
 *     summary: Delete an order item
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order item to delete
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order item deleted successfully
 *       500:
 *          description: Cannot delete Order Item
 */

router.delete('/order-items/:id', async (req, res) => {
    const orderItemId = parseInt(req.params.id);
    try {
        await deleteOrderItem(orderItemId);
        res.status(200);
        res.json({ message: "Order item deleted successfully" });
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});


////////////////// USERS ///////////////
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user
 *               password:
 *                 type: string
 *                 description: The password of the new user
 *               email:
 *                 type: string
 *                 description: The email address of the new user
 *             required:
 *               - username
 *               - password
 *               - email
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created user
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Cannot create User
 */

router.post('/users', async (req, res) => {
    const { username, password,email } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    try {
        const user = await createUser(username, password,email);
        res.status(201);
        res.json(user);
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */
router.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await findUser(userId);
        // in this version, we return the password which is not secured
        res.status(200);
        res.json(user);
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /users/name/{name}:
 *   get:
 *     summary: Retrieve a user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */

router.get('/users/name/:name', async (req, res) => {
    const userName = req.params.name;
    try {
        const user = await findUserbyName(userName);
        // in this version, we return the password which is not secured
        res.status(200).json(user);
    } catch (error) {
//        if (error.message === 'User not found') {
//            res.status(404);
//            res.json({ error: error.message });
//        } else {
            res.status(404);
            res.json({ error: error.message });
//        }
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: Cannot delete user
 */
router.delete('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        await deleteUser(userId);
        res.status(200);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Update a user's password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose password is being updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Invalid or missing newPassword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or missing newPassword
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */

router.put('/users/:id/password', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string') {
        res.status(400).json({ error: 'Invalid or missing newPassword' });
        return;
    }

    try {
        await updateUserPassword(userId, newPassword);
        // In this version, we return the new password which is not secure
        res.status(200);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

////////////////// BOOKS  ///////////////

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reference:
 *                     type: integer
 *                       description: The reference ID of the book
 *                   title:
 *                     type: string
 *                     description: The title of the book
 *                   author:
 *                     type: string
 *                     description: The author of the book
 *                   editor:
 *                     type: string
 *                     description: The editor of the book
 *                   year:
 *                     type: integer
 *                     description: The publication year of the book
 *                   price:
 *                     type: number
 *                     description: The price of the book
 *                   description:
 *                     type: string
 *                     description: A brief description of the book
 *                   cover:
 *                     type: string
 *                     description: The URL or path to the book's cover image
 *                   stock:
 *                     type: integer
 *                     description: The number of copies available in stock
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the book was created
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the book was last updated
 *       404:
 *         description: No books found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No books found
 */

router.get('/books', async (req, res) => {
    try {
        const books = await showBooks();
        if (books.length === 0) {
            res.status(404);
            res.json({ error: 'No books found' });
        } else {
            res.json(books);
        }
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /books/reference/{reference}:
 *   get:
 *     summary: Retrieve a book by its reference
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reference ID of the book
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reference:
 *                   type: integer
 *                   description: The reference ID of the book
 *                 title:
 *                   type: string
 *                   description: The title of the book
 *                 author:
 *                   type: string
 *                   description: The author of the book
 *                 editor:
 *                   type: string
 *                   description: The editor of the book
 *                 year:
 *                   type: integer
 *                   description: The publication year of the book
 *                 price:
 *                   type: number
 *                   description: The price of the book
 *                 description:
 *                   type: string
 *                   description: A brief description of the book
 *                 cover:
 *                   type: string
 *                   description: The URL or path to the book's cover image
 *                 stock:
 *                   type: integer
 *                   description: The number of copies available in stock
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the book was created
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the book was last updated
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Book not found
 */
router.get('/books/reference/:reference', async (req, res) => {
    const bookRef = parseInt(req.params.reference);
    try {
        const book = await findBook(bookRef);
        res.json(book);

    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search for books by title
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title or partial title of the book to search for
 *     responses:
 *       200:
 *         description: Books matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reference:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   editor:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   cover:
 *                     type: string
 *                   stock:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No books found with the given title
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No books found with the given title
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/books/search', async (req, res) => {
    const bookTitle = req.query.title;
    try {
        const books = await findBookByTitle(bookTitle);
        if (books.length === 0) {
            res.status(404);
            res.json({ error: 'No books found with the given title' });
        } else {
            res.json(books);
        }
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: integer
 *                 description: The unique reference ID for the book
 *               title:
 *                 type: string
 *                 description: The title of the book
 *               author:
 *                 type: string
 *                 description: The author of the book
 *               editor:
 *                 type: string
 *                 description: The editor of the book
 *               year:
 *                 type: integer
 *                 description: The publication year of the book
 *               price:
 *                 type: number
 *                 description: The price of the book
 *               description:
 *                 type: string
 *                 description: A brief description of the book
 *               cover:
 *                 type: string
 *                 description: The URL or path to the book's cover image
 *             required:
 *               - reference
 *               - title
 *               - author
 *               - editor
 *               - year
 *               - price
 *               - description
 *               - cover
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reference:
 *                   type: integer
 *                   description: The reference ID of the created book
 *       400:
 *         description: Missing fields to create book entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing fields to create book entry
 *       500:
 *         description: Error creating book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error creating book
 */
router.post('/books', async (req, res) => {
    const { reference, title, author, editor, year, price, description,cover } = req.body;

    if (!reference || !title || !author || !editor || !year || !price || !description || !cover) {
        res.status(400);
        res.json({ error: 'Missing fields to create book entry' });
        return res;
    }

    try {
        const bookData = { reference, title, author, editor, year, price, description,cover,stock:0 };
        const createdBook = await createBook(bookData);
        res.status(201);
        res.json(createdBook);
    } catch (error) {
        res.status(500);
        res.json({ error: 'Error creating book' });
    }

    /**
     * @swagger
     * /books/consume/{reference}:
     *   put:
     *     summary: Decrement the stock of a book
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: reference
     *         required: true
     *         schema:
     *           type: integer
     *         description: The reference ID of the book to decrement stock
     *     responses:
     *       200:
     *         description: Book stock decremented successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Book stock decremented
     *       404:
     *         description: Book out of stock or not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Book out of stock or not found
     */

    router.put('/books/consume/:reference', async (req, res) => {
        const bookRef = parseInt(req.params.reference);
        try {
            await consumeBookStock(bookRef);
            res.status(200);
            res.json({ message: "Book stock decremented" });
        } catch (error) {
            res.status(404);
            res.json({ error: error.message });
        }
    });

    /**
     * @swagger
     * /books/replenish/{reference}:
     *   put:
     *     summary: Replenish the stock of a book
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: reference
     *         required: true
     *         schema:
     *           type: integer
     *         description: The reference ID of the book to replenish stock
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               amount:
     *                 type: integer
     *                 description: The amount to replenish the stock
     *             required:
     *               - amount
     *     responses:
     *       200:
     *         description: Book stock replenished successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Book stock replenished
     *       400:
     *         description: Invalid amount to replenish
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Invalid amount to replenish
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    router.put('/books/replenish/:reference', async (req, res) => {
        const bookRef = parseInt(req.params.reference);
        const { amount } = req.body;
        if (!amount || amount < 1) {
            res.status(400);
            res.json({ error: "Invalid amount to replenish" });
            return;
        }
        try {
            await replenishBookStock(bookRef, amount);
            res.status(200);
            res.json({ message: "Book stock replenished" });
        } catch (error) {
            res.status(500);
            res.json({ error: error.message });
        }
    });

    /**
     * @swagger
     * /books/stock/{reference}:
     *   get:
     *     summary: Get the stock of a specific book
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: reference
     *         required: true
     *         schema:
     *           type: integer
     *         description: The reference ID of the book to retrieve the stock for
     *     responses:
     *       200:
     *         description: Stock retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 stock:
     *                   type: integer
     *                   description: The available stock of the book
     *       404:
     *         description: Book not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Book not found
     */
    router.get('/books/stock/:reference', async (req, res) => {
        const bookRef = parseInt(req.params.reference);
        try {
            const stock = await getBookStock(bookRef);
            res.status(200);
            res.json({ stock });
        } catch (error) {
            res.status(404);
            res.json({ error: error.message });
        }
    });


    /**
     * @swagger
     * /books/{reference}:
     *   delete:
     *     summary: Delete a book by its reference
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: reference
     *         required: true
     *         schema:
     *           type: integer
     *         description: The reference ID of the book to delete
     *     responses:
     *       200:
     *         description: Book deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Book deleted successfully
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    router.delete('/books/:reference', async (req, res) => {
        const bookRef = parseInt(req.params.reference);
        try {
            await deleteBook(bookRef);
            res.status(200);
            res.json({ message: "Book deleted successfully" });
        } catch (error) {
            res.status(500);
            res.json({ error: error.message });
        }
    });

    /**
     * @swagger
     * /books/title/{title}:
     *   delete:
     *     summary: Delete books by title
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: title
     *         required: true
     *         schema:
     *           type: string
     *         description: The title of the books to delete
     *     responses:
     *       200:
     *         description: Book(s) deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Book(s) deleted successfully
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    router.delete('/books/title/:title', async (req, res) => {
        const bookTitle = req.params.title;
        try {
            await deleteBookByTitle(bookTitle);
            res.status(200);
            res.json({ message: 'Book(s) deleted successfully' });
        } catch (error) {
            res.status(500);
            res.json({ error: error.message });
        }
    });
    router.put('/books/stock/:reference', async (req, res) => {
        const bookRef = parseInt(req.params.reference);
        try {
            await consumeBookStock(bookRef);  // Decrement the stock using your function
            res.status(200).json({ message: "Book stock decremented" });
        } catch (error) {
            console.error(error);  // Log any errors on the backend
            res.status(404).json({ error: error.message });
        }
    });

// New API route to increment stock
// New route to replenish stock
    router.put('/books/stock/replenish/:reference', async (req, res) => {
        const bookRef = parseInt(req.params.reference);  // Get the book reference from the URL
        const { amount } = req.body;  // Amount to replenish (should be 1)

        // Validate the amount to ensure it's positive
        if (amount !== 1) {
            return res.status(400).json({ error: 'Invalid amount value. It must be 1.' });
        }

        try {
            await replenishBookStock(bookRef, amount); // Replenish the stock by 1 using the replenish function

            res.status(200).json({ message: `Stock replenished successfully by ${amount}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error while replenishing stock' });
        }
    });

});
