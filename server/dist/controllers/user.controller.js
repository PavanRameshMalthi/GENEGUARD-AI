import { User } from '../models/User.js';
import { formatResponse } from '../utils/helpers.js';
export const getProfile = async (req, res) => {
    res.json(formatResponse(true, req.user));
};
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user)
            return res.status(404).json(formatResponse(false, null, 'User not found'));
        const { name, age, gender, height, weight, bloodGroup, medicalHistory, familyHistory } = req.body;
        if (name && typeof name === 'string') {
            user.name = name.trim();
        }
        const updatedProfile = { ...user.profile };
        if (age !== undefined)
            updatedProfile.age = age;
        if (gender !== undefined)
            updatedProfile.gender = gender;
        if (height !== undefined)
            updatedProfile.height = height;
        if (weight !== undefined)
            updatedProfile.weight = weight;
        if (bloodGroup !== undefined)
            updatedProfile.bloodGroup = bloodGroup;
        if (medicalHistory !== undefined)
            updatedProfile.medicalHistory = medicalHistory;
        if (familyHistory !== undefined)
            updatedProfile.familyHistory = familyHistory;
        user.profile = updatedProfile;
        // Security: user.role is intentionally NOT modified or assigned from req.body
        await user.save();
        res.json(formatResponse(true, user));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const updateSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user)
            return res.status(404).json(formatResponse(false, null, 'User not found'));
        const { theme, notifications, language, privacy } = req.body;
        const currentSettings = user.settings || {};
        if (theme !== undefined)
            currentSettings.theme = theme;
        if (notifications !== undefined)
            currentSettings.notifications = Boolean(notifications);
        if (language !== undefined)
            currentSettings.language = language;
        if (privacy !== undefined) {
            currentSettings.privacy = {
                shareData: privacy.shareData !== undefined ? Boolean(privacy.shareData) : currentSettings.privacy?.shareData || false,
                analytics: privacy.analytics !== undefined ? Boolean(privacy.analytics) : currentSettings.privacy?.analytics || true
            };
        }
        user.settings = currentSettings;
        await user.save();
        res.json(formatResponse(true, user));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user)
            return res.status(404).json(formatResponse(false, null, 'User not found'));
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json(formatResponse(false, null, 'Old password and new password are required'));
        }
        if (!(await user.comparePassword(oldPassword))) {
            return res.status(400).json(formatResponse(false, null, 'Invalid old password'));
        }
        user.password = newPassword;
        await user.save();
        res.json(formatResponse(true, null, 'Password updated'));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
