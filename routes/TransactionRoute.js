import express from "express";
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateVerifyTransaction,
    updateDenyTransaction,
    updateTransaction,
    deleteTransaction,
    getPendingTransactions
} from "../controllers/Transaction.js";

import { verifyUser, verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/transactions/:userId',verifyToken, getTransactions);
router.get('/pending_transactions/:userId',verifyToken, getPendingTransactions);
// router.get('/transactions/:id', verifyUser, getTransactionById);
router.post('/transactions/:userId',verifyToken, createTransaction);
// router.patch('/transactions/:id', verifyUser, updateTransaction);
router.patch('/transactions/:id',verifyToken, updateVerifyTransaction);
router.patch('/deny_transactions/:id',verifyToken, updateDenyTransaction);
router.delete('/transactions/:id',verifyToken, verifyUser, deleteTransaction);

export default router;