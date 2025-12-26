const mongoose = require('mongoose');

const shippingZoneSchema = mongoose.Schema({
    zoneName: {
        type: String,
        required: true,
    },
    cities: {
        type: String, // Comma-separated cities
        default: '',
    },
    deliveryTime: {
        type: String,
        default: '2-3 أيام عمل',
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    freeShippingMinimum: {
        type: Number,
        default: 0, // 0 means no free shipping threshold
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const shippingContentSchema = mongoose.Schema({
    // General Info
    pageTitle: {
        type: String,
        default: 'الشحن والتوصيل',
    },
    introText: {
        type: String,
        default: 'نوفر خدمة توصيل سريعة وآمنة لجميع مناطق المملكة العربية السعودية',
    },
    // Free Shipping Banner
    freeShippingEnabled: {
        type: Boolean,
        default: true,
    },
    freeShippingMinimum: {
        type: Number,
        default: 300,
    },
    freeShippingText: {
        type: String,
        default: 'شحن مجاني للطلبات فوق',
    },
    // Shipping Companies
    shippingCompanies: {
        type: String,
        default: 'SMSA, أرامكس, DHL',
    },
    // Policies
    returnPolicy: {
        type: String,
        default: 'يمكنك استرجاع المنتج خلال 7 أيام من تاريخ الاستلام في حالة وجود عيب بالمنتج',
    },
    exchangePolicy: {
        type: String,
        default: 'يمكنك استبدال المنتج خلال 7 أيام من تاريخ الاستلام',
    },
    packagingInfo: {
        type: String,
        default: 'نحرص على تغليف منتجاتنا بعناية فائقة للحفاظ على جودتها',
    },
    // Contact for shipping issues
    shippingSupport: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const ShippingZone = mongoose.model('ShippingZone', shippingZoneSchema);
const ShippingContent = mongoose.model('ShippingContent', shippingContentSchema);

module.exports = { ShippingZone, ShippingContent };
