import express from 'express';
import {
    createUser,
    findUser,
    createBook,
    findBook,
    deleteBook,
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
    createOrder
} from "./queries";

export const router = express.Router();

////////////////// ORDERS ///////////////

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 */
router.post('/orders', async (req, res) => {
    const { userId, total, status } = req.body;
    try {
        const order = await createOrder(userId, total, status);
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
 */
router.get('/orders/:id', async (req, res) => {
    const orderId = parseInt(req.params.id);
    try {
        const order = await findOrderById(orderId);
        res.status(200);
        res.json(order);
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 */
router.put('/orders/:id/status', async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    try {
        const order = await updateOrderStatus(orderId, status);
        res.status(200);
        res.json(order);
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
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
 *                   id:
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
 * /books/id/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: The book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
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
router.get('/books/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const book = await findBook(bookId);
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
 *                   id:
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
router.post('/books/search', async (req, res) => {
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
 *             required: ["id", "title", "author", "editor", "year", "price", "description"]
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
// Définition de la route pour créer un livre
router.post('/books', async (req, res) => {
    const { title, author, editor, year, price, description } = req.body;

    if (!title || !author || !editor || !year || !price || !description) {
        res.status(400);
        res.json({ error: 'Missing fields to create book entry' });
        return res;
    }

    try {
        const bookData = { title, author, editor, year, price, description, stock: 0 };
        const createdBook = await createBook(bookData);
        res.status(201);
        res.json(createdBook);
    } catch (error) {
        res.status(500);
        res.json({ error: 'Error creating book' });
    }
});

// Route pour consommer un stock de livre
router.put('/books/consume/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        await consumeBookStock(bookId);
        res.status(200);
        res.json({ message: "Book stock decremented" });
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

// Route pour réapprovisionner le stock d'un livre
router.put('/books/replenish/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { amount } = req.body;

    if (!amount || amount < 1) {
        res.status(400);
        res.json({ error: "Invalid amount to replenish" });
        return;
    }

    try {
        await replenishBookStock(bookId, amount);
        res.status(200);
        res.json({ message: "Book stock replenished" });
    } catch (error) {
        res.status(500);
        res.json({ error: error.message });
    }
});

// Route pour obtenir le stock d'un livre
router.get('/books/stock/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const stock = await getBookStock(bookId);
        res.status(200);
        res.json({ stock });
    } catch (error) {
        res.status(404);
        res.json({ error: error.message });
    }
});

// Route pour supprimer un livre (commentée dans ton code)
// router.delete('/books/:id', async (req, res) => {
//     const bookId = parseInt(req.params.id);
//     try {
//         await deleteBook(bookId);
//         res.status(200);
//         res.json({ message: "Book deleted successfully" });
//     } catch (error) {
//         res.status(500);
//         res.json({ error: error.message });
//     }
// });

// Route pour vérifier l'état de l'API
router.get('/', async (req, res) => {
    console.log('Entering route');
    res.status(200);
    res.json({ "status": 200, "message": "API server OK" });
});
