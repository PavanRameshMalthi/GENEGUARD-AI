import { Request, Response } from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { formatResponse } from '../utils/helpers.js';

const generateToken = (id: string) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response) => {
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
    const assignedRole: 'user' | 'admin' = (normalizedEmail === ENV.ADMIN_EMAIL.toLowerCase().trim()) 
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
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(formatResponse(false, null, 'Email and password are required'));
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (user && (await user.comparePassword(password))) {
      // Re-verify designated admin role upon successful login
      if (user.email.toLowerCase().trim() === ENV.ADMIN_EMAIL.toLowerCase().trim() && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      } else if (user.email.toLowerCase().trim() !== ENV.ADMIN_EMAIL.toLowerCase().trim() && user.role === 'admin') {
        user.role = 'user';
        await user.save();
      }

      const token = generateToken(user._id.toString());
      res.json(formatResponse(true, {
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      }));
    } else {
      res.status(401).json(formatResponse(false, null, 'Invalid email or password'));
    }
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  res.json(formatResponse(true, null, 'Password reset instructions sent to email.'));
};

export const getMe = async (req: any, res: Response) => {
  res.json(formatResponse(true, { user: req.user }));
};