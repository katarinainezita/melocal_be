import express from "express";
import {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity
} from "../controllers/Activities.js";

import { verifyTokenForAdmin, verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/activities', getActivities);
router.get('/activities/:id', verifyToken, getActivityById);
router.post('/activities', verifyTokenForAdmin, createActivity); // ada user id param
router.patch('/activities/:id', verifyTokenForAdmin, updateActivity);
router.delete('/activities/:id', verifyTokenForAdmin, deleteActivity);

export default router;
