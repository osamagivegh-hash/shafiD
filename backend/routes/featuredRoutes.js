const express = require('express');
const router = express.Router();
const DateProduct = require('../models/DateProduct');
const HoneyProduct = require('../models/HoneyProduct');
const OudProduct = require('../models/OudProduct');
const SpiceProduct = require('../models/SpiceProduct');

// @desc    Get featured/best products from all categories
// @route   GET /api/v1/products/featured
// @access  Public
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        // Get top rated products from each category
        const [dates, honey, oud, spices] = await Promise.all([
            DateProduct.find({ isActive: true }).sort({ rating: -1 }).limit(Math.ceil(limit / 4)),
            HoneyProduct.find({ isActive: true }).sort({ rating: -1 }).limit(Math.ceil(limit / 4)),
            OudProduct.find({ isActive: true }).sort({ rating: -1 }).limit(Math.ceil(limit / 4)),
            SpiceProduct.find({ isActive: true }).sort({ rating: -1 }).limit(Math.ceil(limit / 4)),
        ]);

        // Combine and add category info
        const featured = [
            ...dates.map(p => ({ ...p.toObject(), category: 'dates', categoryArabic: 'تمور' })),
            ...honey.map(p => ({ ...p.toObject(), category: 'honey', categoryArabic: 'عسل' })),
            ...oud.map(p => ({ ...p.toObject(), category: 'oud', categoryArabic: 'عود' })),
            ...spices.map(p => ({ ...p.toObject(), category: 'spices', categoryArabic: 'بهارات' })),
        ];

        // Shuffle and limit
        const shuffled = featured.sort(() => 0.5 - Math.random()).slice(0, limit);

        res.json(shuffled);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get best sellers (most recently added active products)
// @route   GET /api/v1/products/bestsellers
// @access  Public
router.get('/bestsellers', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const [dates, honey, oud, spices] = await Promise.all([
            DateProduct.find({ isActive: true }).sort({ createdAt: -1 }).limit(2),
            HoneyProduct.find({ isActive: true }).sort({ createdAt: -1 }).limit(2),
            OudProduct.find({ isActive: true }).sort({ createdAt: -1 }).limit(2),
            SpiceProduct.find({ isActive: true }).sort({ createdAt: -1 }).limit(2),
        ]);

        const bestsellers = [
            ...dates.map(p => ({ ...p.toObject(), category: 'dates', categoryArabic: 'تمور' })),
            ...honey.map(p => ({ ...p.toObject(), category: 'honey', categoryArabic: 'عسل' })),
            ...oud.map(p => ({ ...p.toObject(), category: 'oud', categoryArabic: 'عود' })),
            ...spices.map(p => ({ ...p.toObject(), category: 'spices', categoryArabic: 'بهارات' })),
        ];

        res.json(bestsellers.slice(0, limit));
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
