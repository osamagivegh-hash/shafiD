const express = require('express');
const router = express.Router();
const FooterContent = require('../models/FooterContent');

// @desc    Get footer content
// @route   GET /api/v1/footer
// @access  Public
router.get('/', async (req, res) => {
    try {
        let footer = await FooterContent.findOne();

        // If no footer exists, create default one
        if (!footer) {
            footer = await FooterContent.create({});
        }

        res.json(footer);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update footer content
// @route   PUT /api/v1/footer
// @access  Admin
router.put('/', async (req, res) => {
    try {
        const {
            email,
            phone,
            whatsapp,
            instagram,
            twitter,
            tiktok,
            snapchat,
            aboutText,
            address,
            workingHours,
        } = req.body;

        let footer = await FooterContent.findOne();

        if (!footer) {
            footer = await FooterContent.create(req.body);
        } else {
            footer = await FooterContent.findByIdAndUpdate(
                footer._id,
                {
                    email,
                    phone,
                    whatsapp,
                    instagram,
                    twitter,
                    tiktok,
                    snapchat,
                    aboutText,
                    address,
                    workingHours,
                },
                { new: true, runValidators: true }
            );
        }

        res.json({ message: 'Footer updated successfully', footer });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
