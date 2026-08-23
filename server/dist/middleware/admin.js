import { ENV } from '../config/env.js';
/**
 * Strict Admin Authorization Middleware:
 * 1. Confirms authenticated user exists.
 * 2. Confirms user database role is 'admin'.
 * 3. Confirms user email matches configured ADMIN_EMAIL.
 * 4. Rejects any other caller with 403 Forbidden.
 */
export const requireAdmin = (req, res, next) => {
    if (req.user &&
        req.user.role === 'admin' &&
        req.user.email &&
        req.user.email.toLowerCase().trim() === ENV.ADMIN_EMAIL.toLowerCase().trim()) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Forbidden: Administrator privileges required'
    });
};
// Export alias for backwards compatibility
export const admin = requireAdmin;
