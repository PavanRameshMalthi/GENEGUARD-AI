/**
 * Authentication Rate Limiter (Login, Register, Forgot Password)
 * - Protects against brute-force attacks.
 * - Uses skipSuccessfulRequests: true so legitimate logins do not deplete quota.
 * - Generous limit in development to avoid locking developers out during testing.
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * General API Rate Limiter
 * - Protects general endpoints against spam/flooding.
 * - Ample headroom (1000 req / 15 min in prod, 5000 in dev) for smooth single-page app navigation.
 */
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * AI & Copilot Endpoint Rate Limiter
 * - Protects Gemini AI quota and compute resources.
 */
export declare const aiLimiter: import("express-rate-limit").RateLimitRequestHandler;
