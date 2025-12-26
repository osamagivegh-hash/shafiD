const express = require('express');
const router = express.Router();
const SpiceProduct = require('../models/SpiceProduct');

// Validate image path helper
const isValidImagePath = (path) => {
    if (!path) return false;
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isUrl = /^https?:\/\//i.test(path);
    const isLocalPath = path.startsWith('/');
    return (isUrl || isLocalPath) && (validExtensions.test(path) || isUrl);
};

// @desc    Get all spice products (public - active only)
// @route   GET /api/v1/products/spices
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await SpiceProduct.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all spice products (admin - all)
// @route   GET /api/v1/products/spices/admin
// @access  Admin
router.get('/admin', async (req, res) => {
    try {
        const products = await SpiceProduct.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get single spice product
// @route   GET /api/v1/products/spices/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await SpiceProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a spice product
// @route   POST /api/v1/products/spices
// @access  Admin
router.post('/', async (req, res) => {
    try {
        const { title, type, weight, price, imagePath, stock, ingredients, usageDescription, rating } = req.body;

        if (!title || !type || !weight || !price || !imagePath) {
            return res.status(400).json({ message: 'Title, type, weight, price, and image path are required' });
        }

        if (!isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await SpiceProduct.create({
            title,
            type,
            weight,
            price,
            imagePath,
            stock: stock || 0,
            ingredients: ingredients || '',
            usageDescription: usageDescription || '',
            rating: rating || 5,
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update a spice product
// @route   PUT /api/v1/products/spices/:id
// @access  Admin
router.put('/:id', async (req, res) => {
    try {
        const { title, type, weight, price, imagePath, stock, ingredients, usageDescription, isActive, rating } = req.body;

        if (imagePath && !isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const product = await SpiceProduct.findByIdAndUpdate(
            req.params.id,
            { title, type, weight, price, imagePath, stock, ingredients, usageDescription, isActive, rating },
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

// @desc    Delete a spice product
// @route   DELETE /api/v1/products/spices/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        const product = await SpiceProduct.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
