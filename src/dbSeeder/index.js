import dotenv from "dotenv"
dotenv.config(); 
import colors from "colors"
import mongoose from 'mongoose'
import permissionSeeder from "./permissionsSeeder.js";
import roleSeeder from "./roleSeeder.js";
import categoryseed from "./categortSeeder.js";
import userSeeder from "./userSeeder.js";


const mode = process.env.TYPE;

// CONNECT WITH MONOGODB WITH MONGOOSE
const conectMongoDB = async () => {
    try {
        let connect = await mongoose.connect(mode === 'test' ? process.env.MONGOOSE_TEST_STRING : process.env.MONGOOSE_STRING , {
            useNewUrlParser: true,
            serverSelectionTimeoutMS : 5000
        });
        console.log(`MongoDB Server Conected on PORT ${mongoose.connection.host}`.white.bgGreen)
        await permissionSeeder();
        await roleSeeder();
        await categoryseed();
        await userSeeder();
        console.log('All seed functions executed successfully.'.bgWhite);

    } catch (error) {
        console.log(`${error}`.white.bgRed)
    }    
}

conectMongoDB('test');

