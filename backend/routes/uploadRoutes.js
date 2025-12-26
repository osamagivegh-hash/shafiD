const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
    return process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_API_KEY !== 'YOUR_API_KEY_HERE';
};

// Cloudinary Storage Configuration
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const category = req.params.category || 'general';
        return {
            folder: `shafi-store/${category}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }],
        };
    },
});

// Local Storage Configuration (fallback)
const directories = ['hero', 'dates', 'honey', 'oud', 'spices', 'general'];
directories.forEach(dir => {
    const dirPath = path.join(__dirname, '../uploads', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const category = req.params.category || 'general';
        const uploadPath = path.join(__dirname, '../uploads', category);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp, svg)'));
    }
};

// Create upload middleware based on configuration
const getUploadMiddleware = () => {
    if (isCloudinaryConfigured()) {
        console.log('✅ Using Cloudinary for image uploads');
        return multer({
            storage: cloudinaryStorage,
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
            fileFilter: fileFilter
        });
    } else {
        console.log('⚠️ Cloudinary not configured, using local storage');
        return multer({
            storage: localStorage,
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: fileFilter
        });
    }
};

const upload = getUploadMiddleware();

// @desc    Upload single image
// @route   POST /api/v1/upload/:category
// @access  Admin
router.post('/:category', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let imagePath;

        if (isCloudinaryConfigured()) {
            // Cloudinary returns the full URL
            imagePath = req.file.path;
        } else {
            // Local storage returns relative path
            imagePath = `/uploads/${req.params.category}/${req.file.filename}`;
        }

        res.status(201).json({
            message: 'Image uploaded successfully',
            imagePath: imagePath,
            filename: req.file.filename || req.file.public_id,
            isCloudinary: isCloudinaryConfigured()
        });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

// @desc    Delete an image
// @route   DELETE /api/v1/upload/:category/:filename
// @access  Admin
router.delete('/:category/:filename', async (req, res) => {
    try {
        if (isCloudinaryConfigured()) {
            // Delete from Cloudinary
            const publicId = `shafi-store/${req.params.category}/${req.params.filename}`;
            await cloudinary.uploader.destroy(publicId);
            res.json({ message: 'Image deleted successfully from Cloudinary' });
        } else {
            // Delete from local storage
            const filePath = path.join(__dirname, '../uploads', req.params.category, req.params.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                res.json({ message: 'Image deleted successfully' });
            } else {
                res.status(404).json({ message: 'Image not found' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
});

// @desc    Check upload configuration status
// @route   GET /api/v1/upload/status
// @access  Admin
router.get('/status', (req, res) => {
    res.json({
        cloudinaryConfigured: isCloudinaryConfigured(),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'Not set',
        storageType: isCloudinaryConfigured() ? 'Cloudinary Cloud' : 'Local Storage'
    });
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ message: error.message });
    }
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

module.exports = router;
