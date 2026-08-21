import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile: {
        age: {
            type: Number,
            min: [1, 'Age must be at least 1'],
            max: [120, 'Age cannot exceed 120']
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer not to say']
        },
        height: {
            type: Number,
            min: [50, 'Height must be at least 50 cm'],
            max: [250, 'Height cannot exceed 250 cm']
        },
        weight: {
            type: Number,
            min: [10, 'Weight must be at least 10 kg'],
            max: [500, 'Weight cannot exceed 500 kg']
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        medicalHistory: [{ type: String, trim: true }],
        familyHistory: [{ type: String, trim: true }]
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
