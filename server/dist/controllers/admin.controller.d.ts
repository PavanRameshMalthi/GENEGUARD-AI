import { Response } from 'express';
export declare const getStats: (req: any, res: Response) => Promise<void>;
export declare const getUsers: (req: any, res: Response) => Promise<void>;
export declare const getAssessments: (req: any, res: Response) => Promise<void>;
export declare const getLogs: (req: any, res: Response) => Promise<void>;
export declare const deleteUser: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
