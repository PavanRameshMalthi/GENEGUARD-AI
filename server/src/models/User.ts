import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  profile?: {
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    bloodGroup?: string;
    medicalHistory?: string[];
    familyHistory?: string[];
  };
  settings?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    language?: string;
    privacy?: {
      shareData?: boolean;
      analytics?: boolean;
    };
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: {
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    bloodGroup: String,
    medicalHistory: [String],
    familyHistory: [String]
  },
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    privacy: {
      shareData: { type: Boolean, default: false },
      analytics: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);