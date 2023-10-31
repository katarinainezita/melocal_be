import express from "express";
import {
    // getSesi,
    getSesiById,
    createSesi,
    updateSesi,
    updateSesiSlot,
    deleteSesi
} from "../controllers/Sesi.js";

import { verifyUser, verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();
// verifyUser

// router.get('/sesis', getSesi);
router.get('/sesis/:activityId', verifyToken, getSesiById);
router.post('/sesis/:activityId', verifyToken, createSesi);
router.put('/sesis/:id',verifyToken, updateSesi);
router.patch('/sesis/:id',verifyToken, updateSesiSlot);
router.delete('/sesis/:id',verifyToken, deleteSesi);

export default router;