import { Response } from 'express';
export declare const createGoal: (req: any, res: Response) => Promise<void>;
export declare const getGoals: (req: any, res: Response) => Promise<void>;
export declare const getGoalById: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateGoal: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteGoal: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
