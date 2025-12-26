const express = require('express');
const router = express.Router();
const HoneyProduct = require('../models/HoneyProduct');

// Validate image path helper
const isValidImagePath = (path) => {
    if (!path) return false;
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isUrl = /^https?:\/\//i.test(path);
    const isLocalPath = path.startsWith('/');
    return (isUrl || isLocalPath) && (validExtensions.test(path) || isUrl);
};

// @desc    Get all honey products (public)
// @route   GET /api/v1/products/honey
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await HoneyProduct.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all honey products (admin)
// @route   GET /api/v1/products/honey/admin
// @access  Admin
router.get('/admin', async (req, res) => {
    try {
        const products = await HoneyProduct.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get single honey product
// @route   GET /api/v1/products/honey/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await HoneyProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a honey product
// @route   POST /api/v1/products/honey
// @access  Admin
router.post('/', async (req, res) => {
    try {
        const { title, origin, weight, price, imagePath, stock, healthBenefits, rating } = req.body;

        if (!title || !origin || !weight || !price || !imagePath) {
            return res.status(400).json({ message: 'Title, origin, weight, price, and image path are required' });
        }

        if (!isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await HoneyProduct.create({
            title,
            origin,
            weight,
            price,
            imagePath,
            stock: stock || 0,
            healthBenefits: healthBenefits || '',
            rating: rating || 5,
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update a honey product
// @route   PUT /api/v1/products/honey/:id
// @access  Admin
router.put('/:id', async (req, res) => {
    try {
        const { imagePath } = req.body;

        if (imagePath && !isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await HoneyProduct.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Delete a honey product
// @route   DELETE /api/v1/products/honey/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        const product = await HoneyProduct.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
