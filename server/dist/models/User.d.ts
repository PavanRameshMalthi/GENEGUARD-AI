import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    profile?: {
        age?: number;
        gender?: string;
        height?: number;
        weight?: number;
        bloodGroup?: string;
        medicalHistory?: string[];
        familyHistory?: string[];
    };
    settings?: {
        theme?: 'light' | 'dark';
        notifications?: boolean;
        language?: string;
        privacy?: {
            shareData?: boolean;
            analytics?: boolean;
        };
    };
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
