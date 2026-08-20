import { Response } from 'express';
export declare const sendMessage: (req: any, res: Response) => Promise<void>;
export declare const getHistory: (req: any, res: Response) => Promise<void>;
export declare const deleteHistory: (req: any, res: Response) => Promise<void>;
