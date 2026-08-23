import { Response } from 'express';
export declare const getWeeklyReports: (req: any, res: Response) => Promise<void>;
export declare const getLatestWeeklyReport: (req: any, res: Response) => Promise<void>;
export declare const getWeeklyReportById: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateWeeklyReport: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
