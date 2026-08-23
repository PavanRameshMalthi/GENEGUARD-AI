import mongoose from 'mongoose';
export interface CreateNotificationInput {
    userId: mongoose.Types.ObjectId | string;
    title: string;
    message: string;
    type: 'tracking' | 'goal' | 'report' | 'weekly' | 'system' | 'reminder';
    link?: string;
}
export declare const createNotification: (input: CreateNotificationInput) => Promise<(mongoose.Document<unknown, {}, import("../models/Notification.js").INotification, {}, {}> & import("../models/Notification.js").INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const checkAndGenerateActivityNotifications: (userId: string | mongoose.Types.ObjectId) => Promise<void>;
