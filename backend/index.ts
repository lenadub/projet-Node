import express, { Application } from "express";
import { Server } from "http";
import {router} from "./data/routes"
import cors from "cors";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Options } from 'swagger-jsdoc';
import { OpenAPIV3 } from "openapi-types";
import { CorsOptions } from 'cors';

const app: Application = express();
const PORT:number = 3000

const corsOptions:CorsOptions = {
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
const swaggerOptions: Options = {
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

const swaggerSpec: OpenAPIV3.Document = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Prevent CORS errors
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin")
  next();
})

//Start API server
const server:Server = app.listen(PORT, () :void => {
  console.log(`\nAPI server is started on port ${PORT}`)
  console.log(`  to connect, point your browser to http://localhost:${PORT}`)
  console.log("  to stop server, type CONTROL C")
})


// Gracefull server shutdown
function shutdown() :void {
  console.log(" shutting down API server")
  server.close( () :void => {
    console.log("API server is closed.")
    process.exit(0)
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

