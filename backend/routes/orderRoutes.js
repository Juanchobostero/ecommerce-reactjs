import express from "express";
import { 
    addOrderItems, 
    getMyOrders, 
    getOrderById, 
    getOrders, 
    updateOrderToDelivered, 
    updateOrderToDispatched, 
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
//antes era /pay
router.route('/:id/dispatch').put(protect, updateOrderToDispatched);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);


export default router;