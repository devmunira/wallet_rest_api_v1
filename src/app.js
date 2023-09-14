import express from 'express';
import dotenv from 'dotenv';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
const swaggerSpec = YAML.load('./docs/swagger.yaml')
import {middleware , notFoundHandellar , globalErrorHandellar } from './middleware/index.js';
import router from './routes/index.js';


dotenv.config();
const app = express();

// Global middleware set
app.use(middleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route
app.use('/api/v1' , router)


// Global error handler
app.use([notFoundHandellar, globalErrorHandellar]);


export default app;