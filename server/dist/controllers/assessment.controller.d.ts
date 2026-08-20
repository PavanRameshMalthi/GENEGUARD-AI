import { Response } from 'express';
export declare const createAssessment: (req: any, res: Response) => Promise<void>;
export declare const getAssessments: (req: any, res: Response) => Promise<void>;
export declare const getAssessment: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
