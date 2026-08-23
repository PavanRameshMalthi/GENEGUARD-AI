import mongoose from 'mongoose';

export interface IFamilyMember extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  relation: 'father' | 'mother' | 'paternal_grandfather' | 'paternal_grandmother' | 'maternal_grandfather' | 'maternal_grandmother' | 'brother' | 'sister' | 'son' | 'daughter';
  name?: string;
  age?: number;
  isLiving: boolean;
  conditions: string[]; // e.g. ['Diabetes Type 2', 'Hypertension', 'Coronary Artery Disease', 'Breast Cancer']
  ageOfOnset?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const familyMemberSchema = new mongoose.Schema<IFamilyMember>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  relation: {
    type: String,
    enum: [
      'father', 
      'mother', 
      'paternal_grandfather', 
      'paternal_grandmother', 
      'maternal_grandfather', 
      'maternal_grandmother', 
      'brother', 
      'sister', 
      'son', 
      'daughter'
    ],
    required: true
  },
  name: { type: String, trim: true, maxlength: 100 },
  age: { type: Number, min: 0, max: 130 },
  isLiving: { type: Boolean, default: true },
  conditions: [{ type: String, trim: true }],
  ageOfOnset: { type: Number, min: 0, max: 130 },
  notes: { type: String, trim: true, maxlength: 500 }
}, { timestamps: true });

familyMemberSchema.index({ userId: 1, relation: 1 });

export const FamilyMember = mongoose.model<IFamilyMember>('FamilyMember', familyMemberSchema);
