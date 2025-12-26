const mongoose = require('mongoose');

const footerContentSchema = mongoose.Schema({
    // Contact Info
    email: {
        type: String,
        default: 'info@shafi-store.com',
    },
    phone: {
        type: String,
        default: '+966 50 000 0000',
    },
    whatsapp: {
        type: String,
        default: '',
    },
    // Social Media Links
    instagram: {
        type: String,
        default: '',
    },
    twitter: {
        type: String,
        default: '',
    },
    tiktok: {
        type: String,
        default: '',
    },
    snapchat: {
        type: String,
        default: '',
    },
    // Additional Info
    aboutText: {
        type: String,
        default: 'متجر شافي للتمور والعود والعسل الفاخر',
    },
    address: {
        type: String,
        default: 'المملكة العربية السعودية',
    },
    workingHours: {
        type: String,
        default: 'السبت - الخميس: 9 صباحاً - 10 مساءً',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('FooterContent', footerContentSchema);
