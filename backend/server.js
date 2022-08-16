import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import mercadopago from 'mercadopago';

dotenv.config();

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running ...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => 
    res.send(process.env.PAYPAL_CLIENT_ID)
);

//MERCADO PAGO TEST (CREAR PREFERENCE)
/* app.post("/api/create_preference", (req, res) => {

	let preference = {
		items: req.body.orderItems,
		back_urls: {
			"success": "http://localhost:3000/feedback",
			"failure": "http://localhost:3000/feedback",
			"pending": "http://localhost:3000/feedback"
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
}); */

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// errorMiddleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
);