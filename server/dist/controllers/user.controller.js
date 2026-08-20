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
        user.profile = { ...user.profile, ...req.body };
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
        user.settings = { ...user.settings, ...req.body };
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
