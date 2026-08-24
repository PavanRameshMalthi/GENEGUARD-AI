import { Response } from 'express';
export declare const getProfile: (req: any, res: Response) => Promise<void>;
export declare const updateProfile: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSettings: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePassword: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const exportUserDataJSON: (req: any, res: Response) => Promise<void>;
export declare const exportUserDataCSV: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAccount: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const purgeSelectiveData: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
