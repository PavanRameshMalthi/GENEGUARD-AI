import { Notification } from '../models/Notification.js';
import { formatResponse } from '../utils/helpers.js';
import { checkAndGenerateActivityNotifications } from '../services/notification.service.js';
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        // Check and generate any pending activity notifications
        await checkAndGenerateActivityNotifications(userId);
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(30);
        const unreadCount = await Notification.countDocuments({ userId, isRead: false });
        res.json(formatResponse(true, { notifications, unreadCount }));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { $set: { isRead: true } }, { new: true });
        if (!notification)
            return res.status(404).json(formatResponse(false, null, 'Notification not found'));
        res.json(formatResponse(true, notification));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } });
        res.json(formatResponse(true, null, 'All notifications marked as read'));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!notification)
            return res.status(404).json(formatResponse(false, null, 'Notification not found'));
        res.json(formatResponse(true, null, 'Notification deleted successfully'));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
