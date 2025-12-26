const mongoose = require('mongoose');

const dateProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Khalas', 'Ajwa', 'Sukkary', 'Medjool', 'Safawi', 'Other'],
        required: true,
    },
    weight: {
        type: String, // e.g., "500g", "1kg"
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
    luxuryDescription: {
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

module.exports = mongoose.model('DateProduct', dateProductSchema);
