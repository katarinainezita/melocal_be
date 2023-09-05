import express from "express";
import {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";


const router = express.Router();


router.get('/users',  verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.get('/users/:email', verifyUser, adminOnly, getUserByEmail);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

export default router;