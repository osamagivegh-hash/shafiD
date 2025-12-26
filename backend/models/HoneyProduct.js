const mongoose = require('mongoose');

const honeyProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    origin: {
        type: String, // e.g., "Yemen", "Saudi Arabia", "New Zealand"
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    healthBenefits: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('HoneyProduct', honeyProductSchema);
