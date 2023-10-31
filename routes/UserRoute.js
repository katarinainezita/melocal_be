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
import { verifyUser, adminOnly, verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users',verifyToken, getUsers);
router.get('/users/:id',verifyToken, getUserById);
router.get('/users/:email', verifyUser, verifyToken, adminOnly, getUserByEmail);
router.post('/users', verifyToken, createUser);
router.post('/usermitra', verifyToken, createUserMitra);
router.patch('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyUser, verifyToken, adminOnly, deleteUser);

export default router;