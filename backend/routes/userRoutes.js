import express from "express";
const router = express.Router();
import { 
    authUser, 
    registerUser, 
    getUserProfile,
    updateUserProfile, 
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
// import { rateLimit } from "express-rate-limit";

// // Puedo y debería crear mas, pero vamos viendo.
// const limiterForLoginRequests = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 min
//     limit: 3, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
//     standardHeaders: true, // add the `RateLimit-*` headers to the response
//     legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
//   });

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;