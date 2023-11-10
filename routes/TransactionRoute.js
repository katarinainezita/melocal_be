import express from "express";
import {
    createTransaction,
    updateTransaction,
    getTransactionByStatusPending,
    deleteTransaction,
    getTransactionsSesis,
    getDetailTransaction,
    getTransactionUser,
    getTransactionByStatusSuccess
} from "../controllers/Transaction.js";

import { verifyUser, verifyToken, verifyTokenForMitra } from "../middleware/AuthUser.js";
import { upload } from "../utils/Image.js";

const router = express.Router();

// Fix
router.post('/transaction', upload.single('image'), verifyToken, createTransaction);
router.get('/user/transaction', verifyToken, getTransactionUser);
router.get('/transaction/:sesis_id', verifyToken, getTransactionsSesis);
router.get('/transaction/detail/:id', verifyToken, getDetailTransaction)
router.get('/pending-transaction', verifyTokenForMitra, getTransactionByStatusPending);
router.get('/success-transaction', verifyTokenForMitra, getTransactionByStatusSuccess);
router.put('/transaction/:id', verifyToken, updateTransaction);
router.delete('/transaction/:id', verifyTokenForMitra, deleteTransaction);

export default router;