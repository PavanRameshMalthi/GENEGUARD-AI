import mongoose from 'mongoose';
export interface INotification extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'tracking' | 'goal' | 'report' | 'weekly' | 'system' | 'reminder';
    isRead: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
