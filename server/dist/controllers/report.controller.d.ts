import { Response } from 'express';
export declare const generateHealthReport: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadReport: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const analyzeReportFile: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getReports: (req: any, res: Response) => Promise<void>;
export declare const getReport: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
