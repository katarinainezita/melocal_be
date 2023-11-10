import express from "express";
import {
    getSesiByActivitesId,
    getSesiById,
    createSesi,
    updateSesi,
    deleteSesi
} from "../controllers/Sesi.js";

import { verifyToken, verifyTokenForMitra } from "../middleware/AuthUser.js";

const router = express.Router();
// verifyUser

router.get('/sesis/activites/:id', getSesiByActivitesId);
router.get('/sesis/:id', verifyToken, getSesiById);
router.post('/sesis', verifyTokenForMitra, createSesi);
router.put('/sesis/:id', verifyTokenForMitra, updateSesi);
router.delete('/sesis/:id', verifyTokenForMitra, deleteSesi);

export default router;