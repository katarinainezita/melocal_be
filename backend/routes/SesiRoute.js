import express from "express";
import {
    // getSesi,
    getSesiById,
    createSesi,
    updateSesi,
    updateSesiSlot,
    deleteSesi
} from "../controllers/Sesi.js";

import { verifyUser } from "../middleware/AuthUser.js";



const router = express.Router();
// verifyUser

// router.get('/sesis', getSesi);
router.get('/sesis/:activityId', getSesiById);
router.post('/sesis/:activityId', createSesi);
router.put('/sesis/:id', updateSesi);
router.patch('/sesis/:id', updateSesiSlot);
router.delete('/sesis/:id', deleteSesi);

export default router;