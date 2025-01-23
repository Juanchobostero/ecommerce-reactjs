import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import mercadopago from 'mercadopago';
import cors from 'cors';
import { rateLimit } from "express-rate-limit";

const limiterGeneral = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    limit: 10, // Incrementé el límite para evitar bloqueos constantes
    standardHeaders: true,
    legacyHeaders: false,
});

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3420',
    'https://ecommerce-reactjs-chi.vercel.app',
    'https://ecommerce-reactjs-client-git-juancho-juanchobosteros-projects.vercel.app',
    'https://ecommerce-reactjs-client-git-test-juanchobosteros-projects.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/categories', productCategoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

app.post('/create_preference', async (req, res) => {
    try {
        const url = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3420'
            : process.env.REACT_APP_URI_FRONT_PRODUCTION || 'https://ecommerce-reactjs-client-git-test-juanchobosteros-projects.vercel.app';
        
        let cartItemsMercadoPago = req.body.orderDataMercadoPago.map((item) => ({
            ...item,
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity)
        }));
        let order = req.body.order;
        let preference = {
            items: cartItemsMercadoPago,
            back_urls: {
                "success": `${url}/order/${order}`,
                "failure": `${url}/order/${order}`,
                "pending": `${url}/order/${order}`
            },
            auto_return: 'approved',
            statement_descriptor: 'ECOMMERCE JUAN',
        };

        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating preference');
    }
});

app.post('/notify', (req, res) => {
    try {
        console.log('notify');
        const { body, query } = req;
        console.log({ body, query });
        res.send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Notification error');
    }
});

app.get('/feedback', (req, res) => {
    try {
        res.json({
            Payment: req.query.payment_id,
            Status: req.query.status,
            MerchantOrder: req.query.merchant_order_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Feedback error');
    }
});

app.use('/uploads', express.static('uploads'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
);
