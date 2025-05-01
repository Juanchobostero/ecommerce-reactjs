import ProductCategory from "../models/productCategoryModel.js";
import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler';

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 10; // Cambia este valor si deseas mostrar más productos por página
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword })

    const products = await Product.aggregate([
        { $match: { ...keyword } },
        { $sort: { created_at: -1 } }, // Orden descendente por fecha de creación
        { $skip: (page - 1) * pageSize },
        { $limit: count },
        {
            $lookup: {
                from: 'productcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryName',
            },
        },
    ]);

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc Get all product categories, and stock count by them
// @route GET /api/products/categories
// @access Public
const getCategoriesWithCount = asyncHandler( async (req, res) => {

    const categories = await Product.aggregate([ 
        {
            $group: { 
                _id: '$categoryName',
                totalQuantity: { 
                    $sum: '$countInStock' 
                } 
            }
        } 
    ]);

    res.json(categories);
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        await product.remove();
        res.json({ message: 'Product removed !' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler( async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        user:  req.user._id,
        description: req.body.description,
        image: req.body.image,
        code: req.body.code,
        discount: req.body.discount,
        countInStock: req.body.countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler( async (req, res) => {
    const { 
        name, 
        price, 
        description, 
        image, 
        code,
        discount, 
        category,
        countInStock 
    } = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.code = code;
        product.discount = discount;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found !');
    } 
});

// @desc Create new review
// @route POST /api/products/:id/review
// @access Private
const createProductReview = asyncHandler( async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if(product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
        
        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed !');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added !' });
    } else {
        res.status(404);
        throw new Error('Product not found !');
    } 
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler( async (req, res) => {
    const products = await Product.find({}).sort({ 'rating': -1 }).limit(3);

    res.json(products);
});

export { 
    getProducts, 
    getProductById, 
    deleteProduct, 
    createProduct, 
    updateProduct,
    createProductReview,
    getTopProducts,
    getCategoriesWithCount 
};