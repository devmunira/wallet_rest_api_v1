import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()



// CONNECT WITH MONOGODB WITH MONGOOSE
const conectMongoDB = async (mode = 'development') => {
    try {
        let connect = await mongoose.connect(mode === 'test' ? process.env.MONGOOSE_TEST_STRING : process.env.MONGOOSE_STRING , {
            useNewUrlParser: true,
            // serverSelectionTimeoutMS : 5000
        });
        console.log(`MongoDB Server Conected on PORT ${mongoose.connection.host}`.white.bgGreen)
    } catch (error) {
        console.log(`${error}`.white.bgRed)
    }    
}

export default conectMongoDB