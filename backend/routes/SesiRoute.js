import express from "express";
import {
    // getSesi,
    getSesiById,
    createSesi,
    updateSesi,
    deleteSesi
} from "../controllers/Sesi.js";

import { verifyUser } from "../middleware/AuthUser.js";



const router = express.Router();
// verifyUser

// router.get('/sesis', getSesi);
router.get('/sesis/:activityId', getSesiById);
router.post('/sesis/:activityId', createSesi);
router.put('/sesis/:id', updateSesi);
router.delete('/sesis/:id', deleteSesi);

export default router;