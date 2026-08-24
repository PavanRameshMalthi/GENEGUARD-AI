import dotenv from 'dotenv';
dotenv.config();
export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/geneguard',
    JWT_SECRET: process.env.JWT_SECRET || 'geneguard_secret_jwt_key_2026',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    ADMIN_EMAIL: (process.env.ADMIN_EMAIL || 'pavanrameshmalthi886@gmail.com').toLowerCase().trim()
};
