import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
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
export const Notification = mongoose.model('Notification', notificationSchema);
