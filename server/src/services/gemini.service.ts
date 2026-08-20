import { genAI } from '../config/gemini.js';

const DISCLAIMER = 'GeneGuard AI provides educational wellness insights only. It is not a medical diagnosis. Always consult a qualified healthcare professional.';
const SYSTEM_PROMPT = `You are GeneGuard AI, a preventive healthcare assistant. Important: You are NOT a medical diagnosis tool. \nAlways end your response with: "${DISCLAIMER}"`;

export const analyzeHealth = async (assessmentData: any) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `${SYSTEM_PROMPT}\nAnalyze the following health data and provide a JSON response with keys: healthScore (0-100), healthSummary, riskFactors (array of strings), lifestyleImprovements (array of strings), dietSuggestions (array of strings), exerciseSuggestions (array of strings), hydrationAdvice, mentalWellnessTips (array of strings), preventiveCheckups (array of strings), whenToVisitDoctor.\nData: ${JSON.stringify(assessmentData)}`;
  
  try {
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 }});
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Gemini error:', error);
    return null;
  }
};

export const chatResponse = async (messages: any[], userMessage: string) => {
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
    if (!text.includes(DISCLAIMER)) text += `\n\n${DISCLAIMER}`;
    return text;
  } catch (error) {
    console.error('Gemini error:', error);
    return `An error occurred.\n\n${DISCLAIMER}`;
  }
};

export const analyzeReport = async (fileName: string, fileType: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `${SYSTEM_PROMPT}\nThe user has uploaded a medical report of type: ${fileType} named ${fileName}. Since I cannot read the actual file content, provide a general summary about this type of report and recommend discussing it with a doctor.`;
  
  try {
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 }});
    return result.response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    return `Unable to analyze report.\n\n${DISCLAIMER}`;
  }
};

export const generateRecommendations = async (userProfile: any) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `${SYSTEM_PROMPT}\nGenerate personalized daily health tips based on this profile: ${JSON.stringify(userProfile)}. Return a JSON array of strings.`;
  
  try {
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 }});
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini error:', error);
    return [];
  }
};

export const generateWeeklyGoals = async (userProfile: any) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `${SYSTEM_PROMPT}\nGenerate weekly health goals based on this profile: ${JSON.stringify(userProfile)}. Return a JSON array of strings.`;
  
  try {
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 }});
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini error:', error);
    return [];
  }
};