import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
/**
 * Strict Admin Authorization Middleware:
 * 1. Confirms authenticated user exists.
 * 2. Confirms user database role is 'admin'.
 * 3. Confirms user email matches configured ADMIN_EMAIL.
 * 4. Rejects any other caller with 403 Forbidden.
 */
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const admin: (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
