const mongoose = require('mongoose');

const oudProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Aged', 'Incense', 'Oil', 'Chips', 'Muattar', 'Other'],
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
    scentProfile: {
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

module.exports = mongoose.model('OudProduct', oudProductSchema);
