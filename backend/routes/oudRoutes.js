const express = require('express');
const router = express.Router();
const OudProduct = require('../models/OudProduct');

// Validate image path helper
const isValidImagePath = (path) => {
    if (!path) return false;
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isUrl = /^https?:\/\//i.test(path);
    const isLocalPath = path.startsWith('/');
    return (isUrl || isLocalPath) && (validExtensions.test(path) || isUrl);
};

// @desc    Get all oud products (public)
// @route   GET /api/v1/products/oud
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await OudProduct.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all oud products (admin)
// @route   GET /api/v1/products/oud/admin
// @access  Admin
router.get('/admin', async (req, res) => {
    try {
        const products = await OudProduct.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get single oud product
// @route   GET /api/v1/products/oud/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await OudProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create an oud product
// @route   POST /api/v1/products/oud
// @access  Admin
router.post('/', async (req, res) => {
    try {
        const { title, type, price, imagePath, stock, scentProfile, rating } = req.body;

        if (!title || !type || !price || !imagePath) {
            return res.status(400).json({ message: 'Title, type, price, and image path are required' });
        }

        if (!isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await OudProduct.create({
            title,
            type,
            price,
            imagePath,
            stock: stock || 0,
            scentProfile: scentProfile || '',
            rating: rating || 5,
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update an oud product
// @route   PUT /api/v1/products/oud/:id
// @access  Admin
router.put('/:id', async (req, res) => {
    try {
        const { imagePath } = req.body;

        if (imagePath && !isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await OudProduct.findByIdAndUpdate(
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

// @desc    Delete an oud product
// @route   DELETE /api/v1/products/oud/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        const product = await OudProduct.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
