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

const notificationSchema = new mongoose.Schema<INotification>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  type: { 
    type: String, 
    enum: ['tracking', 'goal', 'report', 'weekly', 'system', 'reminder'], 
    default: 'system' 
  },
  isRead: { type: Boolean, default: false, index: true },
  link: { type: String, trim: true }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
