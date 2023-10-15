import express from "express";
import multer from "multer";
import path from "path";
const diskStorage = multer.diskStorage({
  // konfigurasi folder penyimpanan file
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(""), "/uploads"));
  }, // konfigurasi penamaan file yang unik
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

import {
  getImage,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
} from "../controllers/Image.js";

import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();
// verifyUser

router.get("/images", getImage);
router.get("/images/:activityId", getImageById);
router.post(
  "/images/:activityId",
  multer({ storage: diskStorage }).single("photo"),
  createImage
);
router.put("/images/:id", updateImage);
router.delete("/images/:id", deleteImage);

export default router;
