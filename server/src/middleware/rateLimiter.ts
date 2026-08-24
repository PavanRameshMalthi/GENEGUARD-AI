import rateLimit from 'express-rate-limit';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Authentication Rate Limiter (Login, Register, Forgot Password)
 * - Protects against brute-force attacks.
 * - Uses skipSuccessfulRequests: true so legitimate logins do not deplete quota.
 * - Generous limit in development to avoid locking developers out during testing.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 20 : 100, // 20 failed attempts in prod, 100 in dev
  skipSuccessfulRequests: true, // Only count failed requests (4xx/5xx)
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    console.warn(`[AUTH RATE LIMITED] IP: ${_req.ip} exceeded login attempt limit.`);
    res.status(429).json({
      success: false,
      code: 'AUTH_RATE_LIMITED',
      message: 'Too many login attempts. Please try again shortly.'
    });
  }
});

/**
 * General API Rate Limiter
 * - Protects general endpoints against spam/flooding.
 * - Ample headroom (1000 req / 15 min in prod, 5000 in dev) for smooth single-page app navigation.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 1000 : 5000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    console.warn(`[API RATE LIMITED] IP: ${_req.ip} exceeded general API rate limit.`);
    res.status(429).json({
      success: false,
      code: 'API_RATE_LIMITED',
      message: 'Too many requests. Please try again later.'
    });
  }
});

/**
 * AI & Copilot Endpoint Rate Limiter
 * - Protects Gemini AI quota and compute resources.
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 60 : 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    console.warn(`[AI RATE LIMITED] IP: ${_req.ip} exceeded AI copilot query limit.`);
    res.status(429).json({
      success: false,
      code: 'AI_RATE_LIMITED',
      message: 'AI query limit reached. Please wait a few moments before asking another question.'
    });
  }
});