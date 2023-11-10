import express from "express";
import {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    createUserMitra,
    updateUser,
    deleteUser
} from "../controllers/Users.js";
import { verifyToken, verifyTokenForMitra } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyToken, getUsers); // Harusnya buat admin dan mitra
router.get('/users/:id', verifyToken, getUserById); // Harusnya buat admin dan mitra
// router.get('/users/:email', verifyUser, verifyToken, adminOnly, getUserByEmail); // role admin
router.post('/users', createUser);
router.post('/mitra', createUserMitra);
router.put('/users', verifyToken, updateUser);
router.delete('/users/:userId', verifyTokenForMitra, deleteUser); //role admin

export default router;