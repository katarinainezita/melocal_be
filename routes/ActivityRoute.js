import express from "express";
import {
    getActivities,
    getActivityById,
    getActivitiesByMitraId,
    createActivity,
    updateActivity,
    deleteActivity
} from "../controllers/Activities.js";

import { verifyTokenForMitra, verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/activities', getActivities);
router.get('/activities/:id', verifyToken, getActivityById);
router.get('/mitra/activities', verifyTokenForMitra, getActivitiesByMitraId)
router.post('/activities', verifyTokenForMitra, createActivity); // ada user id param
router.patch('/activities/:id', verifyTokenForMitra, updateActivity);
router.delete('/activities/:id', verifyTokenForMitra, deleteActivity);

export default router;