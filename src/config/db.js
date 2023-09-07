import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()



// CONNECT WITH MONOGODB WITH MONGOOSE
const conectMongoDB = async () => {
    try {
        let connect = await mongoose.connect(process.env.MONGOOSE_STRING);
        console.log(`MongoDB Server Conected on PORT ${mongoose.connection.host}`.white.bgGreen)
    } catch (error) {
        console.log(`${error}`.white.bgRed)
    }    
}

export default conectMongoDB