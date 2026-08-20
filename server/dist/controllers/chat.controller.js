import { ChatMessage } from '../models/ChatMessage.js';
import { chatResponse } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        let chat = await ChatMessage.findOne({ userId: req.user._id });
        if (!chat) {
            chat = await ChatMessage.create({ userId: req.user._id, messages: [] });
        }
        const history = chat.messages.slice(-10);
        chat.messages.push({ role: 'user', content: message, timestamp: new Date() });
        const responseText = await chatResponse(history, message);
        chat.messages.push({ role: 'assistant', content: responseText, timestamp: new Date() });
        await chat.save();
        res.json(formatResponse(true, { response: responseText }));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getHistory = async (req, res) => {
    try {
        const chat = await ChatMessage.findOne({ userId: req.user._id });
        res.json(formatResponse(true, chat ? chat.messages : []));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const deleteHistory = async (req, res) => {
    try {
        await ChatMessage.findOneAndDelete({ userId: req.user._id });
        res.json(formatResponse(true, null, 'History deleted'));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
