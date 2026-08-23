import { HealthTimeline } from '../models/HealthTimeline.js';
export const logTimelineEvent = async (input) => {
    try {
        return await HealthTimeline.create({
            userId: input.userId,
            eventType: input.eventType,
            title: input.title,
            description: input.description,
            category: input.category,
            data: input.data || {},
            eventDate: input.eventDate || new Date()
        });
    }
    catch (error) {
        console.error('Error logging health timeline event:', error);
        return null;
    }
};
