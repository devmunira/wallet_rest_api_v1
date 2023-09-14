import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
const swaggerSpec = YAML.load('./docs/swagger.yaml')
import {middleware , notFoundHandellar , globalErrorHandellar } from './src/middleware/index.js';
import router from './src/routes/index.js';
import connectMongoDB from "./src/config/db.js"
import {seedData} from './src/dbSeeder/index.js';


dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT || 4000;

// Global middleware set
app.use(middleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route
app.use('/api/v1' , router)


// Comment Out this function and run the server after sedding exicutuion please comment this function
// seedData()


// Global error handler
app.use([notFoundHandellar, globalErrorHandellar]);

// Connect with DB and Server listening
connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER IS LISTENING ON PORT ${PORT}`.green);
    });
  })
  .catch((err) => console.log(err.message.red));
