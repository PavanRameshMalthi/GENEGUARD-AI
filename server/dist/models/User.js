import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
export const User = mongoose.model('User', userSchema);
