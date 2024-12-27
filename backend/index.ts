import express from "express"
import { findBook, findBookByTitle, showBooks, createBook } from "./data/queries"
import {router} from "./data/routes"
import cors from "cors";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

let app = express();
const PORT = 3000

const corsOptions = {
  origin: '*', // Permet toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
};

console.log('Starting...')
// Appliquer le middleware CORS
app.use(cors(corsOptions));

app.use(express.static('public'));

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
  apis: ['./data/routes.ts'], // Path to the file with Swagger annotations
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Prevent CORS errors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin")
  next();
})

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

