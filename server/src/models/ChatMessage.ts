import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);