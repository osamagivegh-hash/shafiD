const express = require('express');
const router = express.Router();
const HeroSlide = require('../models/HeroSlide');

// Validate image path helper
const isValidImagePath = (path) => {
    if (!path) return false;
    // Check for common image extensions or valid URL patterns
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isUrl = /^https?:\/\//i.test(path);
    const isLocalPath = path.startsWith('/');
    return (isUrl || isLocalPath) && (validExtensions.test(path) || isUrl);
};

// @desc    Get all hero slides (public)
// @route   GET /api/v1/hero
// @access  Public
router.get('/', async (req, res) => {
    try {
        const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all hero slides (admin - includes inactive)
// @route   GET /api/v1/admin/hero
// @access  Admin
router.get('/admin', async (req, res) => {
    try {
        const slides = await HeroSlide.find({}).sort({ order: 1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a hero slide
// @route   POST /api/v1/admin/hero
// @access  Admin
router.post('/admin', async (req, res) => {
    try {
        const { imagePath, titleArabic, subtitleArabic, link, order, isActive } = req.body;

        if (!imagePath || !titleArabic) {
            return res.status(400).json({ message: 'Image path and Arabic title are required' });
        }

        if (!isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const slide = await HeroSlide.create({
            imagePath,
            titleArabic,
            subtitleArabic: subtitleArabic || '',
            link: link || '/',
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true,
        });

        res.status(201).json({ message: 'Slide created successfully', slide });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update a hero slide
// @route   PUT /api/v1/admin/hero/:id
// @access  Admin
router.put('/admin/:id', async (req, res) => {
    try {
        const { imagePath, titleArabic, subtitleArabic, link, order, isActive } = req.body;

        if (imagePath && !isValidImagePath(imagePath)) {
            return res.status(400).json({ message: 'Invalid image path format' });
        }

        const slide = await HeroSlide.findByIdAndUpdate(
            req.params.id,
            { imagePath, titleArabic, subtitleArabic, link, order, isActive },
            { new: true, runValidators: true }
        );

        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }

        res.json({ message: 'Slide updated successfully', slide });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Delete a hero slide
// @route   DELETE /api/v1/admin/hero/:id
// @access  Admin
router.delete('/admin/:id', async (req, res) => {
    try {
        const slide = await HeroSlide.findByIdAndDelete(req.params.id);

        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }

        res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
