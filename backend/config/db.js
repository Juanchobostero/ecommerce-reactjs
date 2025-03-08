import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const { 
    NODE_ENV, 
    MONGO_URI, 
    MONGO_URI_QA 
} = process.env

console.log(`NODE_ENV: ${NODE_ENV}`)

const isDev = NODE_ENV === 'development'
const mongoConn = isDev ? MONGO_URI_QA : MONGO_URI

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoConn, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`MongoDB Connected in ${isDev ? 'DEV' : 'PROD' } mode. Host: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

export default connectDB
