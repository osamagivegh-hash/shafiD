const mongoose = require('mongoose');

const spiceProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['خلطة', 'مفرد', 'بهارات لحم', 'بهارات دجاج', 'بهارات سمك', 'بهارات رز', 'زعفران', 'أخرى'],
        required: true,
    },
    weight: {
        type: String, // e.g., "100g", "250g"
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
    ingredients: {
        type: String, // مكونات البهارات
        default: '',
    },
    usageDescription: {
        type: String, // طريقة الاستخدام
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

module.exports = mongoose.model('SpiceProduct', spiceProductSchema);
