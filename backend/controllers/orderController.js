import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler( async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if(orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save()

        // Actualizar el stock de los productos
        for (const item of orderItems) {
            const product = await Product.findById(item.product)
            if (product) {
                product.countInStock -= item.qty
                await product.save()
            } else {
                res.status(404)
                throw new Error(`Product not found: ${item.product}`)
            }
        }

        res.status(201).json(createdOrder);
    }
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found !');
    }
});

// @desc Update order to paid
// @route GET /api/orders/:id/pay
// @access Private
const updateOrderToDispatched = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id);

    const {
        daysToDispatch
    } = req.body

    if(order) {
        order.isDispatched = true;
        order.dispatchedAt = Date.now();
        order.days = daysToDispatch;

        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found !');
    }
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler( async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler( async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc Update order to delivered
// @route GET /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found !');
    }
});

export { 
    addOrderItems, 
    getOrderById, 
    updateOrderToDispatched, 
    getMyOrders,
    getOrders,
    updateOrderToDelivered 
};