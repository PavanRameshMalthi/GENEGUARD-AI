import { genAI } from '../config/gemini.js';
const DISCLAIMER = 'GeneGuard AI provides educational wellness insights only. It is not a medical diagnosis. Always consult a qualified healthcare professional.';
const SYSTEM_PROMPT = `You are GeneGuard AI, a preventive healthcare assistant. Important: You are NOT a medical diagnosis tool. \nAlways end your response with: "${DISCLAIMER}"`;
export const analyzeHealth = async (assessmentData) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${SYSTEM_PROMPT}\nAnalyze the following comprehensive health data and provide a JSON response exactly matching this structure (do not include markdown codeblocks, just valid JSON):
  {
    "overallHealthSummary": "string",
    "healthScore": number,
    "riskFactors": ["string"],
    "dietPlan": { "breakfast": ["string"], "lunch": ["string"], "dinner": ["string"], "snacks": ["string"], "avoidFoods": ["string"], "healthyFoods": ["string"], "proteinTips": "string", "fiberTips": "string", "sugarReduction": "string" },
    "exercisePlan": { "beginner": [{"name":"string","duration":"string","caloriesBurned":"string","frequency":"string","difficulty":"string"}], "intermediate": [{"name":"string","duration":"string","caloriesBurned":"string","frequency":"string","difficulty":"string"}], "advanced": [{"name":"string","duration":"string","caloriesBurned":"string","frequency":"string","difficulty":"string"}] },
    "sleepAnalysis": { "quality": "string", "idealBedTime": "string", "idealWakeTime": "string", "tips": ["string"] },
    "hydrationAnalysis": { "goal": number, "current": number, "remaining": number, "tips": ["string"] },
    "stressManagement": ["string"],
    "lifestyleImprovements": ["string"],
    "weeklyGoals": ["string"],
    "preventiveHealthAdvice": ["string"],
    "medicalCheckupSuggestions": ["string"],
    "whenToVisitDoctor": "string"
  }
  \nData: ${JSON.stringify(assessmentData)}`;
    try {
        const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } });
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(text);
        return data;
    }
    catch (error) {
        console.error('Gemini error:', error);
        return null;
    }
};
export const chatResponse = async (messages, userMessage) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
    const chat = model.startChat({
        history: history,
        generationConfig: { temperature: 0.7 }
    });
    try {
        const prompt = `${SYSTEM_PROMPT}\nUser: ${userMessage}`;
        const result = await chat.sendMessage(prompt);
        let text = result.response.text();
        if (!text.includes(DISCLAIMER))
            text += `\n\n${DISCLAIMER}`;
        return text;
    }
    catch (error) {
        console.error('Gemini error:', error);
        return `An error occurred.\n\n${DISCLAIMER}`;
    }
};
export const analyzeReport = async (fileName, fileType) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${SYSTEM_PROMPT}\nThe user has uploaded a medical report of type: ${fileType} named ${fileName}. Since I cannot read the actual file content, provide a general summary about this type of report and recommend discussing it with a doctor.`;
    try {
        const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } });
        return result.response.text();
    }
    catch (error) {
        console.error('Gemini error:', error);
        return `Unable to analyze report.\n\n${DISCLAIMER}`;
    }
};
export const generateRecommendations = async (assessmentData) => {
    if (!assessmentData)
        return ['Please complete a health assessment first to receive personalized recommendations.'];
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${SYSTEM_PROMPT}\nGenerate personalized daily health tips based on this assessment data: ${JSON.stringify(assessmentData)}. Return a JSON array of strings.`;
    try {
        const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } });
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    }
    catch (error) {
        console.error('Gemini error:', error);
        return [];
    }
};
export const generateWeeklyGoals = async (assessmentData) => {
    if (!assessmentData)
        return ['Please complete a health assessment first to receive personalized weekly goals.'];
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${SYSTEM_PROMPT}\nGenerate weekly health goals based on this assessment data: ${JSON.stringify(assessmentData)}. Return a JSON array of strings.`;
    try {
        const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } });
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    }
    catch (error) {
        console.error('Gemini error:', error);
        return [];
    }
};
