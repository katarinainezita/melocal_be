import express from "express";
import { login, me, logout } from "../controllers/Auth.js";
import { verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/auth/me', verifyToken, me);
router.post('/auth/login', login);
router.delete('/auth/logout', logout); 

export default router;