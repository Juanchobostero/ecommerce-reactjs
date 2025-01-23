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

mercadopago.configure({
	access_token: "APP_USR-5029250925841563-081611-6d6c33c264b920c6cce47d975f80e384-1180488044",
});

dotenv.config();

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
	app.use(morgan('combine'));
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running ...');
});

app.use(cors({
	origin: 'https://ecommerce-reactjs-chi.vercel.app',
}));

app.use('/api/products', productRoutes);
app.use('/api/categories', productCategoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => 
    res.send(process.env.PAYPAL_CLIENT_ID)
);

// PREFERENCIA MERCADO PAGO
app.post("/create_preference", (req, res) => {
	const url = process.env.NODE_ENV === 'development' 
		? 'http://localhost:3000' 
		: process.env.NODE_BASE_URI_CLIENT_PROD;
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
		auto_return: "approved",
		statement_descriptor: "ECOMMERCE JUAN",
		//notification_url: 'https://1281-201-235-90-251.ngrok-free.app/notify'
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			console.log(response.body);
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.post("/notify", function (req, res) {
	console.log('notify');
	const { body, query } = req;
	console.log({ body, query });
	res.send();
});

app.get("/feedback", function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	})
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// errorMiddleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mercadopago.preferences.findById('1180488044-b8242cf5-9aa5-447d-b120-570549edbf15').then(res => console.log(res.body));

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
);