import express from "express";
import {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity
} from "../controllers/Activities.js";

import { verifyUser } from "../middleware/AuthUser.js";



const router = express.Router();

router.get('/activities', verifyUser, getActivities);
router.get('/activities/:id', verifyUser, getActivityById);
router.post('/activities', verifyUser, createActivity);
router.patch('/activities/:id', verifyUser, updateActivity);
router.delete('/activities/:id', verifyUser, deleteActivity);

export default router;