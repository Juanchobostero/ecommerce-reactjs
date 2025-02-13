import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', 
        allowed_formats: ['jpg', 'jpeg', 'png'], 
    },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    if (req.file && req.file.path) {
        res.send(`${req.file.path}`)
    } else {
        res.status(400).send('Error al subir la imagen :( :(')
    }
});

export default router
