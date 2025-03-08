import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
// console.log("db",process.env.MONGODB_URI)
export const connectDB = async () => {
    // console.log(process.env.MONGODB_URI)
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongodb Connected : ${conn.connection.host}`)
    } catch (error) {
        console.log(`Mongodb Connected issue ${error.message}`)
        process.exit(1)
    }
} 