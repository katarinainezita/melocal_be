import express from "express";
import {Login, logOut, Me} from "../controllers/Auth.js";

const router = express.Router();

router.get('/users/me', Me);
router.post('/users/login', Login);
router.delete('/users/logout', logOut);

export default router;