import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configura Cloudinary
cloudinary.v2.config({
    cloud_name: 'dcvzljyj3',
    api_key: '791171769866529',
    api_secret: 'Bp6NrKELRqjSkGrcrqYNnbNHlHs',
});

// Configura Multer con almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: 'uploads', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'], // Tipos de archivo permitidos
    },
});

const upload = multer({ storage });

// Ruta para subir imágenes
router.post('/', upload.single('image'), (req, res) => {

    if (req.file && req.file.path) {
        res.send(`${req.file.path}`); // Retorna la URL de la imagen subida
    } else {
        res.status(400).send('Error al subir la imagen');
    }
});

export default router;
