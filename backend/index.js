import path from 'path'
import express from 'express'
import colors from "colors"
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import productCategoryRoutes from './routes/productCategoryRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cors from 'cors'

process.loadEnvFile()

connectDB()

const app = express()

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3420',
    'https://ecommerce-reactjs-chi.vercel.app', // PROD vercel
    'https://ecommerce-reactjs-client-git-juancho-juanchobosteros-projects.vercel.app', //JC TEST
    'https://ecommerce-reactjs-client-git-test-juanchobosteros-projects.vercel.app', // QA
    'https://www.elpromesero.com', // PROD
    'https://elpromesero.com' // PROD
]

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions))

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
} else {
	app.use(morgan('combine'))
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('EL PROMESERO API is running ...')
})

app.use('/api/products', productRoutes)
app.use('/api/categories', productCategoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
);