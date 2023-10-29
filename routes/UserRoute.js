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
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";


const router = express.Router();


router.get('/users',  getUsers);
router.get('/users/:id', getUserById);
router.get('/users/:email', verifyUser, adminOnly, getUserByEmail);
router.post('/users', createUser);
router.post('/usermitra', createUserMitra);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

export default router;