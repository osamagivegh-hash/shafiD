const express = require('express');
const router = express.Router();
const { ShippingZone, ShippingContent } = require('../models/Shipping');

// ============ SHIPPING CONTENT ============

// @desc    Get shipping content
// @route   GET /api/v1/shipping/content
// @access  Public
router.get('/content', async (req, res) => {
    try {
        let content = await ShippingContent.findOne();
        if (!content) {
            content = await ShippingContent.create({});
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update shipping content
// @route   PUT /api/v1/shipping/content
// @access  Admin
router.put('/content', async (req, res) => {
    try {
        let content = await ShippingContent.findOne();
        if (!content) {
            content = await ShippingContent.create(req.body);
        } else {
            content = await ShippingContent.findByIdAndUpdate(
                content._id,
                req.body,
                { new: true, runValidators: true }
            );
        }
        res.json({ message: 'Content updated successfully', content });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ============ SHIPPING ZONES ============

// @desc    Get all shipping zones (public - active only)
// @route   GET /api/v1/shipping/zones
// @access  Public
router.get('/zones', async (req, res) => {
    try {
        const zones = await ShippingZone.find({ isActive: true }).sort({ shippingCost: 1 });
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all shipping zones (admin - all)
// @route   GET /api/v1/shipping/zones/admin
// @access  Admin
router.get('/zones/admin', async (req, res) => {
    try {
        const zones = await ShippingZone.find({}).sort({ shippingCost: 1 });
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a shipping zone
// @route   POST /api/v1/shipping/zones
// @access  Admin
router.post('/zones', async (req, res) => {
    try {
        const { zoneName, cities, deliveryTime, shippingCost, freeShippingMinimum } = req.body;

        if (!zoneName) {
            return res.status(400).json({ message: 'Zone name is required' });
        }

        const zone = await ShippingZone.create({
            zoneName,
            cities: cities || '',
            deliveryTime: deliveryTime || '2-3 أيام عمل',
            shippingCost: shippingCost || 0,
            freeShippingMinimum: freeShippingMinimum || 0,
        });

        res.status(201).json({ message: 'Zone created successfully', zone });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update a shipping zone
// @route   PUT /api/v1/shipping/zones/:id
// @access  Admin
router.put('/zones/:id', async (req, res) => {
    try {
        const zone = await ShippingZone.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        res.json({ message: 'Zone updated successfully', zone });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Delete a shipping zone
// @route   DELETE /api/v1/shipping/zones/:id
// @access  Admin
router.delete('/zones/:id', async (req, res) => {
    try {
        const zone = await ShippingZone.findByIdAndDelete(req.params.id);

        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        res.json({ message: 'Zone deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
