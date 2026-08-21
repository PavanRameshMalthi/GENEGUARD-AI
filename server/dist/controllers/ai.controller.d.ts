import { Response } from 'express';
export declare const analyzeHealthData: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const chatWithAI: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
