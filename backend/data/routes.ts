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
    console.log('Entering root');
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
 */
router.get('/orders/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const orders = await findOrderByCustomer(userId);
        res.status(200);
        res.json(orders);
    } catch (error) {
        res.status(500);
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
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
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
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: number
 *       400:
 *         description: Invalid order ID
 *       500:
 *         description: Internal server error
 */
router.get('/orders/:id', async (req, res) => {
    const orderId = parseInt(req.params.id);
    try {
        const order = await findOrderById(orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.put('/orders/:id/status', async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    try {
        const order = await updateOrderStatus(orderId, status);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: The total cost of the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                 total:
 *                   type: number
 *       400:
 *         description: Invalid order ID
 *       500:
 *         description: Internal server error
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
        res.status(500).json({ error: error.message });
    }
});



////////////////// ORDER ITEMS ///////////////
/**
 * @swagger
 * /order-items:
 *   post:
 *     summary: Add an order item
 *     tags: [Order Items]
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
 */
router.get('/order-items/order/:orderId', async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    try {
        const items = await getOrderItemsByOrderId(orderId);
        res.status(200);
        res.json(items);
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /order-items/{id}:
 *   delete:
 *     summary: Delete an order item
 *     tags: [Order Items]
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
 *     summary: Create a user
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
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
 *     summary: Get a user by ID
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
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await findUser(userId);
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
 *     summary: Find a user by name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the user
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
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/users/name/:name', async (req, res) => {
    const userName = req.params.name;
    try {
        const user = await findUserbyName(userName);
        res.status(200).json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404);
            res.json({ error: error.message });
        } else {
            res.status(500);
            res.json({ error: error.message });
        }
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
 *         description: User not found
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
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       404:
 *         description: User not found
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
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
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
 *       404:
 *         description: No books found
 */
router.get('/books', async (req, res) => {
    console.log('Entering showBooks route');
    try {
        const books = await showBooks();
        if (books.length === 0) {
            res.status(404);
            res.json({ error: 'No books found' });
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
 * /books/reference/{reference}:
 *   get:
 *     summary: Get a book by Reference
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book Reference
 *     responses:
 *       200:
 *         description: The book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reference:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 editor:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *       404:
 *         description: Book not found
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
 *     summary: Find books by title
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Book title
 *     responses:
 *       200:
 *         description: Books matching the title
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
 *       404:
 *         description: No books found with the given title
 */
router.get('/books/search', async (req, res) => {
    console.log('Entering findBookByTitle route');
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
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               editor:
 *                 type: string
 *               year:
 *                 type: integer
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *             required: ["reference", "title", "author", "editor", "year", "price", "description"]
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
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
     *     summary: Consume a book stock by decrementing its count
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: reference
     *         required: true
     *         schema:
     *           type: integer
     *         description: Book Reference
     *     responses:
     *       200:
     *         description: Book stock decremented
     *       404:
     *         description: Book out of stock or not found
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
     *         description: Book Reference
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               amount:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Book stock replenished
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
     *         description: Book Reference
     *     responses:
     *       200:
     *         description: Book stock retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 stock:
     *                   type: integer
     *       404:
     *         description: Book not found
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
     *     summary: Delete a book by Reference
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: reference
     *         required: true
     *         schema:
     *           type: integer
     *         description: Book Reference
     *     responses:
     *       200:
     *         description: Book deleted successfully
     *       404:
     *         description: Book not found
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
     *         description: Title of the book
     *     responses:
     *       200:
     *         description: Book(s) deleted successfully
     *       404:
     *         description: No book found with the given title
     *       500:
     *         description: Internal server error
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


});
