import express from "express";
import { login, me, logout } from "../controllers/Auth.js";
import { verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/me', verifyToken, me);
router.post('/users/login', login);
router.delete('/users/logout', logout);

export default router;