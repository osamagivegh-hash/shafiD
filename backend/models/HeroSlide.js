const mongoose = require('mongoose');

const heroSlideSchema = mongoose.Schema({
    imagePath: {
        type: String,
        required: true,
    },
    titleArabic: {
        type: String,
        required: true,
    },
    subtitleArabic: {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '/',
    },
    order: {
        type: Number,
        required: true,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
