import express from "express"
import { findBook, findBookByTitle, showBooks, createBook } from "./data/queries"
import {router} from "./data/routes"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

let app = express();
const PORT = 3000

app.use(express.json());
app.use('/', router);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product API',
      version: '1.0.0',
      description: 'API for managing products',
    },
  },
  apis: ['./route.ts'], // Path to the file with Swagger annotations
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// // Define home route
// app.get('/', (req, res) => {
//   console.log("  Request GET /")
//   res.status(200)
//   res.json({"status": 200, "message": "API server OK"})
// })
//
// app.get("/books", async (req, res) => {
//   let books = await showBooks()
//   console.log("  Request GET /books")
//   // console.log(`  fetched books: ${JSON.stringify(books)}`)
//   res.status(200)
//   res.json(books)
// })
//
// app.get("/books/search", async (req, res) => {
//   let book = await findBookByTitle(req.query.title)
//   console.log(`  Request GET /books/search with title: ${req.query.title}`)
//   res.status(200)
//   res.json(book)
// })
//
//
// app.get("/books/:id", async (req, res) => {
//   let book = await findBook(req.params.id)
//   console.log(`  Request GET /books/:id with param id: ${req.params.id}`)
//   res.status(200)
//   res.json(book)
// })
//
// // Route to create books from the portal
// // To be used by the ecommerce site admin
// app.post("/books", async (req, res) => {
//   let book = await createBook(req.body)
//    console.log(`  Request POST /books/ with param id: ${req.params.id}`)
//    res.status(201)
//    res.json(book)
//  })
//
//

//Start API server
let server = app.listen(PORT, () => {
  console.log(`\nAPI server is started on port ${PORT}`)
  console.log(`  to connect, point your browser to http://localhost:${PORT}`)
  console.log("  to stop server, type CONTROL C")
})


// Gracefull server shutdown
function shutdown() {
  console.log(" shutting down API server")
  server.close( () => {
    console.log("API server is closed.")
    process.exit(0)
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

