import express from "express";
import {
    getActivities,
    getActivityById,
    getActivitiesByMitraId,
    createActivity,
    updateActivity,
    deleteActivity,
    createActivityImage,
    deleteActivityImage
} from "../controllers/Activities.js";

import { verifyTokenForMitra, verifyToken } from "../middleware/AuthUser.js";
import { upload } from "../utils/Image.js";

const router = express.Router();

router.get('/activities', getActivities);
router.get('/activities/:id', verifyToken, getActivityById);
router.get('/mitra/activities', verifyTokenForMitra, getActivitiesByMitraId)
router.post('/activities', upload.array('images'), verifyTokenForMitra, createActivity); // ada user id param
router.put('/activities/:id', verifyTokenForMitra, updateActivity);
router.delete('/activities/:id', verifyTokenForMitra, deleteActivity);

// Image Activites
router.post('/activities/:id/image', upload.single('image'), verifyTokenForMitra, createActivityImage);
router.delete('/activities/:id/image/:image_id', verifyTokenForMitra, deleteActivityImage); 

export default router;