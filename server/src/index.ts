import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/auth.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reportRoutes from './routes/report.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors({ origin: ENV.CLIENT_URL }));
app.use(express.json());
app.use(mongoSanitize());
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.use(errorHandler);

const PORT = ENV.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});