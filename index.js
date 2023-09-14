import dotenv from 'dotenv';
import connectMongoDB from "./src/config/db.js"
import app from "./src/app.js"
import {seedData} from './src/dbSeeder/index.js';
const PORT = process.env.SERVER_PORT || 4000;
import colors from "colors"

// Comment Out this function and run the server after sedding exicutuion please comment this function
// seedData()


// Connect with DB and Server listening
connectMongoDB()
.then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER IS LISTENING ON PORT ${PORT}`.green);
    });
  })
  .catch((err) => console.log(err.message.red));
