import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String, required: true },
    aiSummary: String
}, { timestamps: true });
export const Report = mongoose.model('Report', reportSchema);
