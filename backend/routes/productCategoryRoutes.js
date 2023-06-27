import express from "express";
const router = express.Router();
import { 
    getCategories
} from '../controllers/productCategoryController.js';

router.route('/')
    .get(getCategories)

export default router;