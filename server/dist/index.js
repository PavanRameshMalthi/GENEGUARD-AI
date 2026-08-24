import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { syncAdminSecurity } from './services/admin-init.service.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reportRoutes from './routes/report.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import aiRoutes from './routes/ai.routes.js';
import trackingRoutes from './routes/tracking.routes.js';
import goalsRoutes from './routes/goals.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import weeklyReportRoutes from './routes/weekly-report.routes.js';
import scoreRoutes from './routes/score.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import familyRoutes from './routes/family.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import copilotRoutes from './routes/copilot.routes.js';
const app = express();
// Connect to MongoDB and synchronize admin account security
connectDB().then(() => {
    syncAdminSecurity();
});
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use('/api', apiLimiter);
// Serve uploads folder for report previews
app.use('/uploads', express.static(path.resolve('uploads')));
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'GeneGuard AI API is running', timestamp: new Date().toISOString() });
});
// Register Core APIs
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports/weekly', weeklyReportRoutes);
app.use('/api/weekly-reports', weeklyReportRoutes);
app.use('/api/health/score', scoreRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/copilot', copilotRoutes);
app.use(errorHandler);
const PORT = ENV.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (ENV.GEMINI_API_KEY) {
        console.log('✅ Gemini AI Health Intelligence active');
    }
    else {
        console.log('ℹ️ Gemini API key not detected — Clinical Fallback Intelligence active');
    }
});
