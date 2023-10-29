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

router.get('/activities', getActivities);
router.get('/activities/:userId', getActivityById);
router.post('/activities/:userId', createActivity);
router.patch('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);

export default router;
