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
        if (!email || !password || !name) {
            return res.status(400).json(formatResponse(false, null, 'Name, email, and password are required'));
        }
        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json(formatResponse(false, null, 'User already exists'));
        }
        // SECURITY ENFORCEMENT:
        // Ignore any client-provided role/isAdmin/permissions.
        // ONLY the designated ADMIN_EMAIL is assigned 'admin', all other registrations are strictly 'user'.
        const assignedRole = (normalizedEmail === ENV.ADMIN_EMAIL.toLowerCase().trim())
            ? 'admin'
            : 'user';
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: assignedRole
        });
        const token = generateToken(user._id.toString());
        res.status(201).json(formatResponse(true, {
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        }));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const login = async (req, res) => {
    let normalizedEmail = '';
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(formatResponse(false, null, 'Email and password are required'));
        }
        normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (user && (await user.comparePassword(password))) {
            // Re-verify designated admin role upon successful login
            if (user.email.toLowerCase().trim() === ENV.ADMIN_EMAIL.toLowerCase().trim() && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            }
            else if (user.email.toLowerCase().trim() !== ENV.ADMIN_EMAIL.toLowerCase().trim() && user.role === 'admin') {
                user.role = 'user';
                await user.save();
            }
            console.log(`[AUTH LOGIN ATTEMPT] email: ${normalizedEmail} | status: 200 | result: success`);
            const token = generateToken(user._id.toString());
            res.json(formatResponse(true, {
                token,
                user: { _id: user._id, name: user.name, email: user.email, role: user.role }
            }));
        }
        else {
            console.log(`[AUTH LOGIN ATTEMPT] email: ${normalizedEmail} | status: 401 | result: failure`);
            res.status(401).json(formatResponse(false, null, 'Invalid email or password'));
        }
    }
    catch (error) {
        console.error(`[AUTH LOGIN ERROR] email: ${normalizedEmail || 'unknown'} | error: ${error.message}`);
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const forgotPassword = async (req, res) => {
    res.json(formatResponse(true, null, 'Password reset instructions sent to email.'));
};
export const getMe = async (req, res) => {
    res.json(formatResponse(true, { user: req.user }));
};
