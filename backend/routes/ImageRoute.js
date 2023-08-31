import express from "express";
import {
    getImage,
    getImageById,
    createImage,
    updateImage,
    deleteImage
} from "../controllers/Image.js";

import { verifyUser } from "../middleware/AuthUser.js";



const router = express.Router();
// verifyUser

router.get('/images', getImage);
router.get('/images/:activityId', getImageById);
router.post('/images/:activityId', createImage);
router.put('/images/:id', updateImage);
router.delete('/images/:id', deleteImage);

export default router;