const express = require('express');
const router = express.Router();
const DateProduct = require('../models/DateProduct');

// Validate image path helper
const isValidImagePath = (path) => {
    if (!path) return false;
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isUrl = /^https?:\/\//i.test(path);
    const isLocalPath = path.startsWith('/');
    return (isUrl || isLocalPath) && (validExtensions.test(path) || isUrl);
};

// @desc    Get all date products (public)
// @route   GET /api/v1/products/dates
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await DateProduct.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all date products (admin)
// @route   GET /api/v1/products/dates/admin
// @access  Admin
router.get('/admin', async (req, res) => {
    try {
        const products = await DateProduct.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get single date product
// @route   GET /api/v1/products/dates/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await DateProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a date product
// @route   POST /api/v1/products/dates
// @access  Admin
router.post('/', async (req, res) => {
    try {
        const { title, type, weight, price, imagePath, stock, luxuryDescription, rating } = req.body;

        if (!title || !type || !weight || !price || !imagePath) {
            return res.status(400).json({ message: 'Title, type, weight, price, and image path are required' });
        }

        if (!isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await DateProduct.create({
            title,
            type,
            weight,
            price,
            imagePath,
            stock: stock || 0,
            luxuryDescription: luxuryDescription || '',
            rating: rating || 5,
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update a date product
// @route   PUT /api/v1/products/dates/:id
// @access  Admin
router.put('/:id', async (req, res) => {
    try {
        const { imagePath } = req.body;

        if (imagePath && !isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await DateProduct.findByIdAndUpdate(
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

// @desc    Delete a date product
// @route   DELETE /api/v1/products/dates/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        const product = await DateProduct.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
