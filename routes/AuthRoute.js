import express from "express";
import { login, me, logout } from "../controllers/Auth.js";

const router = express.Router();

router.get('/users/me', me);
router.post('/users/login', login);
router.delete('/users/logout', logout);

export default router;