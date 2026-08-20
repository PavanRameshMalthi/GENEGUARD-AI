import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
export declare const admin: (req: AuthRequest, res: Response, next: NextFunction) => void;
