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

import { verifyUser } from "../middleware/AuthUser.js";



const router = express.Router();

router.get('/transactions/:userId', getTransactions);
router.get('/pending_transactions/:userId', getPendingTransactions);
// router.get('/transactions/:id', verifyUser, getTransactionById);
router.post('/transactions/:userId', createTransaction);
// router.patch('/transactions/:id', verifyUser, updateTransaction);
router.patch('/transactions/:id', updateVerifyTransaction);
router.patch('/deny_transactions/:id', updateDenyTransaction);
router.delete('/transactions/:id', verifyUser, deleteTransaction);

export default router;