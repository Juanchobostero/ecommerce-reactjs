import ProductCategory from "../models/productCategoryModel.js";
import asyncHandler from 'express-async-handler';
import Product from "../models/productModel.js";

// @desc Fetch all categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler( async (req, res) => {
    const categories = await ProductCategory.find({})

    res.json(categories);
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

export { 
    getCategories,
    getCategoriesWithCount
};