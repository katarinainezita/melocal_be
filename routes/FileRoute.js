import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const ext = path.extname(originalName); // Dapatkan ekstensi asli file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext); // Tambahkan ekstensi ke nama file
  },
});

const upload = multer({ storage });

router.post('/upload', upload.array('image'), (req, res) => {
  console.log(req.body);
  res.send('Single File Upload Success');
});

const filePath = 'uploads/'

router.get('/image/:id', (req, res) => {
  const { id } = req.params;
  const file = `${filePath}${id}`;
  // Gunakan opsi 'binary' atau tidak ada opsi untuk membaca file biner
  fs.readFile(file, (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      res.status(500).send('Error reading the file');
    } else {
      // Set header untuk tipe konten gambar yang sesuai
      res.setHeader('Content-Type', 'image/jpeg'); // Ganti dengan tipe konten yang sesuai
      res.end(data);
    }
  });
});

export default router;
