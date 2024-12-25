import express from 'express';
import { createUser, findUser, createBook, findBook, deleteBook, updateBook, showBooks, findBookByTitle} from  "./queries"

export const router = express.Router();

// Route to show  all books
router.get('/books', async (req, res) => {
    console.log('Entering showBooks route');
    try {
        const books = await showBooks();
        if (books.length === 0) {
            res.status(404).json({ error: 'No books found' });
        } else {
            res.json(books);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /books/id/{id}:
 *   get:
 *     summary: Get a book  by ID
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
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Book not found
 */
router.get('/books/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const book = await findBook(bookId);
        res.json(book);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Route to find books by title
router.get('/books/search', async (req, res) => {
    console.log('Entering findBookByTitle route');
    const bookTitle = req.query.title;
    try {
        const books = await findBookByTitle(bookTitle);
        if (books.length === 0) {
            res.status(404).json({ error: 'No books found with the given title' });
        } else {
            res.json(books);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to create books from the portal
// To be used by the ecommerce site admin
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new Book
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
 *                 type: number
 *               price:
 *                 type: float
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/books', async (req, res) => {

    // parse body of request
    const { id, title, author, editor, year, price, description } = req.body;

    // check for prerequiste fields
    // throw error if not there
    if (!id || !title || !author || !editor || !year || !price || !description) {
        return res.status(400).json({ error: 'Missing fields to create book entry' });
    }

    try {
        const bookData = { id, title, author, editor, year, price, description };
        const createdBook = await createBook(bookData);
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(500).json({ error: 'Error creating book' });
    }
});