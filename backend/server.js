const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration - supports both local and production
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL, // Cloud Run frontend URL
].filter(Boolean);

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        // Check if origin is allowed or is a Cloud Run URL
        if (allowedOrigins.includes(origin) ||
            origin.endsWith('.run.app') ||
            origin.endsWith('.web.app')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Routes
const heroRoutes = require('./routes/heroRoutes');
const datesRoutes = require('./routes/datesRoutes');
const honeyRoutes = require('./routes/honeyRoutes');
const oudRoutes = require('./routes/oudRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const footerRoutes = require('./routes/footerRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const spicesRoutes = require('./routes/spicesRoutes');
const featuredRoutes = require('./routes/featuredRoutes');

app.use('/api/v1/hero', heroRoutes);
app.use('/api/v1/products/dates', datesRoutes);
app.use('/api/v1/products/honey', honeyRoutes);
app.use('/api/v1/products/oud', oudRoutes);
app.use('/api/v1/products/spices', spicesRoutes);
app.use('/api/v1/products/featured', featuredRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/footer', footerRoutes);
app.use('/api/v1/shipping', shippingRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database Seeder
const seedHeroSlides = require('./seeder');
const HeroSlide = require('./models/HeroSlide');

const startServer = async () => {
    if (process.env.MONGO_URI) {
        await connectDB();
        try {
            const count = await HeroSlide.countDocuments();
            if (count === 0) {
                console.log('Seeding initial hero slides...');
                await seedHeroSlides();
            }
        } catch (e) {
            console.log('Skipping auto-seed due to DB error or first run issues');
        }
    } else {
        console.log('MONGO_URI not found in .env, skipping DB connection');
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
