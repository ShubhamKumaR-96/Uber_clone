import express from "express";
import { getMe, login, register } from "../controllers/authController.js";
import { loginRateLimiter, registerRateLimiter } from "../middleware/rateLimiter.js";
import { validateLogin, validateRegister } from "../validator/authValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerRateLimiter, validateRegister, register);
router.post('/login',loginRateLimiter,validateLogin,login)
router.post('/me',protect,getMe);


export default router;
