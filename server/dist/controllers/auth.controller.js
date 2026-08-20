import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { formatResponse } from '../utils/helpers.js';
const generateToken = (id) => {
    return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: '30d' });
};
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json(formatResponse(false, null, 'User already exists'));
        const user = await User.create({ name, email, password });
        res.status(201).json(formatResponse(true, {
            _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id.toString())
        }));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json(formatResponse(true, {
                _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id.toString())
            }));
        }
        else {
            res.status(401).json(formatResponse(false, null, 'Invalid email or password'));
        }
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const forgotPassword = async (req, res) => {
    res.json(formatResponse(true, null, 'Password reset instructions sent to email.'));
};
export const getMe = async (req, res) => {
    res.json(formatResponse(true, req.user));
};
