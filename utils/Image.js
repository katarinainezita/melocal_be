import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const imageName = uuidv4();
    const filePath = Date.now() + '-' + imageName;

    cb(null, filePath + ext);
  },
});

const upload = multer({ storage });

export { upload };