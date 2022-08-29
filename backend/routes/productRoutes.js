import express from "express";
const router = express.Router();
import { 
    createProduct,
    createProductReview,
    deleteProduct, 
    getCategoriesWithCount, 
    getProductById, 
    getProducts, 
    getTopProducts, 
    updateProduct
} from '../controllers/productController.js';
import { protect, admin } from "../middleware/authMiddleware.js";

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.get('/categories', getCategoriesWithCount);
router.route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;