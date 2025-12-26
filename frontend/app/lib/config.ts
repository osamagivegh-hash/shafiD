// API Configuration - uses environment variable in production
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Extract base backend URL from API_URL
export const BACKEND_URL = API_URL.replace('/api/v1', '');

// Helper to get full image URL
export const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    // If it's already a full URL (Cloudinary), use as-is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend backend URL
    return `${BACKEND_URL}${imagePath}`;
};
