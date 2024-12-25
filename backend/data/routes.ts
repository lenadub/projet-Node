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
    replenishBookStock, consumeBookStock, getBookStock, deleteUser
} from "./queries";

export const router = express.Router();

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
    console.log('Entering route');
    res.status(200);
    res.json({ "status": 200, "message": "API server OK" });
});

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
router.get('/books/id/:id', async (req, res) => {
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
router.post('/books', async (req, res) => {
    const { title, author, editor, year, price, description } = req.body;

    if (!title || !author || !editor || !year || !price || !description) {
        res.status(400);
        res.json({ error: 'Missing fields to create book entry' });
        return res;
    }

    try {
        const bookData = { title, author, editor, year, price, description,stock:0 };
        const createdBook = await createBook(bookData);
        res.status(201);
        res.json(createdBook);
    } catch (error) {
        res.status(500);
        res.json({ error: 'Error creating book' });
    }

    /**
     * @swagger
     * /books/consume/{id}:
     *   put:
     *     summary: Consume a book stock by decrementing its count
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
     *         description: Book stock decremented
     *       404:
     *         description: Book out of stock or not found
     */
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

    /**
     * @swagger
     * /books/replenish/{id}:
     *   put:
     *     summary: Replenish the stock of a book
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Book ID
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

    /**
     * @swagger
     * /books/stock/{id}:
     *   get:
     *     summary: Get the stock of a specific book
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
    router.get('/books/stock/:id', async (req, res) => {
        const bookId = parseInt(req.params.id);
        try {
            const stock = await getBookStock(bookId);
            res.status(200).json({ stock });
        } catch (error) {
            res.status(404).json({ error: error.message });
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
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
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
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
});
