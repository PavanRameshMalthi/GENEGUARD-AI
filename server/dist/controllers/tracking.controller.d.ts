import { Response } from 'express';
export declare const upsertDailyTracking: (req: any, res: Response) => Promise<void>;
export declare const getTrackingHistory: (req: any, res: Response) => Promise<void>;
export declare const getTodayTracking: (req: any, res: Response) => Promise<void>;
export declare const getTrackingById: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTracking: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
