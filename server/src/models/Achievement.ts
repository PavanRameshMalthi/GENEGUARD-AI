import mongoose from 'mongoose';

export interface IBadge {
  id: string; // e.g. 'hydration_hero', 'century_walker'
  title: string;
  description: string;
  category: 'streak' | 'activity' | 'assessment' | 'goals' | 'hydration' | 'sleep' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  unlockedAt: Date;
  xpValue: number;
}

export interface IUserAchievement extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  streaks: {
    dailyTracking: { current: number; longest: number; lastDate?: string };
    hydrationGoal: { current: number; longest: number; lastDate?: string };
    sleepGoal: { current: number; longest: number; lastDate?: string };
    stepsGoal: { current: number; longest: number; lastDate?: string };
  };
  totalXp: number;
  level: number;
  unlockedBadges: IBadge[];
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['streak', 'activity', 'assessment', 'goals', 'hydration', 'sleep', 'mastery'],
    required: true
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  icon: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
  xpValue: { type: Number, default: 50 }
}, { _id: false });

const achievementSchema = new mongoose.Schema<IUserAchievement>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  streaks: {
    dailyTracking: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastDate: { type: String }
    },
    hydrationGoal: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastDate: { type: String }
    },
    sleepGoal: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastDate: { type: String }
    },
    stepsGoal: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastDate: { type: String }
    }
  },
  totalXp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  unlockedBadges: [badgeSchema]
}, { timestamps: true });

export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', achievementSchema);
