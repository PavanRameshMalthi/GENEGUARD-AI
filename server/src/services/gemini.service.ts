import { getGeminiClient, hasGeminiConfigured } from '../config/gemini.js';

const DISCLAIMER = 'GeneGuard AI provides educational wellness insights only. It is not a medical diagnosis. Always consult a qualified healthcare professional.';
const SYSTEM_PROMPT = `You are GeneGuard AI, an advanced preventive healthcare assistant. Important: You are NOT a medical diagnosis tool.
Analyze the provided health data and provide personalized, actionable preventive wellness advice.
Always end your text responses with: "${DISCLAIMER}"`;

// Helper: Smart Clinical Fallback Analysis Engine
export const generateSmartClinicalAnalysis = (data: any) => {
  const calculations = data.calculations || {};
  const personalInfo = data.personalInfo || {};
  const lifestyle = data.lifestyle || {};
  const physicalActivity = data.physicalActivity || {};
  const nutrition = data.nutrition || {};
  const medicalHistory = data.medicalHistory || {};
  const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];

  const bmi = calculations.bmi || 22;
  const bmiCategory = calculations.bmiCategory || 'Normal';
  const age = personalInfo.age || 30;
  const gender = personalInfo.gender || 'unspecified';
  const healthScore = calculations.healthScore || 80;
  const sleepHours = lifestyle.sleepHours || 7;
  const dailyWater = lifestyle.dailyWaterIntake || 2.5;
  const stressLevel = lifestyle.stressLevel || 5;
  const steps = physicalActivity.stepsPerDay || 6000;

  // Build tailored risk factors
  const riskFactors: string[] = [];
  if (lifestyle.smoking === 'yes') {
    riskFactors.push('Active smoking increases cardiovascular and respiratory vulnerability.');
  }
  if (lifestyle.alcohol === 'frequently') {
    riskFactors.push('Frequent alcohol consumption may elevate liver enzyme stress and metabolic strain.');
  }
  if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
    riskFactors.push(`BMI of ${bmi} (${bmiCategory}) indicates increased metabolic and cardiac workload.`);
  } else if (bmiCategory === 'Underweight') {
    riskFactors.push(`BMI of ${bmi} is below standard range; consider nutritional density assessment.`);
  }
  if (sleepHours < 6) {
    riskFactors.push(`Chronic short sleep duration (${sleepHours} hrs/night) impairs endocrine recovery and immunity.`);
  }
  if (stressLevel >= 7) {
    riskFactors.push(`Elevated chronic stress level (${stressLevel}/10) can elevate cortisol and blood pressure.`);
  }
  if (dailyWater < 2) {
    riskFactors.push(`Daily fluid intake (${dailyWater} L) is below recommended physiological requirements.`);
  }
  if (steps < 5000) {
    riskFactors.push('Sedentary activity profile with low daily step volume increases cardiovascular risk.');
  }
  if (medicalHistory.diabetes || data.familyHistory?.diabetes) {
    riskFactors.push('Family or personal predisposition to glycemic fluctuations requires carbohydrate monitoring.');
  }
  if (medicalHistory.bloodPressure || data.familyHistory?.hypertension) {
    riskFactors.push('Elevated risk profile for hypertension; routine vascular pressure monitoring recommended.');
  }
  if (riskFactors.length === 0) {
    riskFactors.push('No acute high-risk lifestyle factors identified; focus on continuous baseline preservation.');
  }

  // Summary
  const overallHealthSummary = `Based on your biometrics (${age} y/o ${gender}, BMI ${bmi} - ${bmiCategory}) and lifestyle inputs, your preventive health score is ${healthScore}/100. ${
    healthScore >= 80 
      ? 'You maintain a strong baseline of health habits. Focusing on targeted optimizations will sustain long-term vitality.'
      : healthScore >= 60 
      ? 'Your profile shows moderate health stability with clear opportunities to enhance hydration, sleep regularity, and structured physical activity.'
      : 'Your assessment highlights multiple compounding areas for preventive intervention, particularly managing daily stress, physical exertion, and dietary balance.'
  } Always discuss personalized health regimens with your physician.`;

  // Diet Plan
  const dietPlan = {
    breakfast: [
      'Steel-cut oatmeal topped with chia seeds, walnuts, and fresh berries',
      'Poached eggs with sautéed spinach and whole-grain sourdough toast',
      'Greek yogurt bowl with crushed flaxseed, cinnamon, and sliced apple'
    ],
    lunch: [
      'Grilled chicken or lemon-herb tofu with quinoa, avocado, and steamed broccoli',
      'Mediterranean chickpea salad with cucumbers, bell peppers, olive oil, and feta',
      'Lentil vegetable stew served with mixed leafy greens and brown rice'
    ],
    dinner: [
      'Baked wild salmon or tempeh with roasted sweet potatoes and asparagus',
      'Stir-fried colorful vegetables with edamame, ginger, garlic, and wild rice',
      'Zucchini noodles with lean turkey or mushroom bolognese and side salad'
    ],
    snacks: [
      'Handful of raw almonds and walnuts',
      'Sliced cucumber and carrots with garlic hummus',
      'Fresh pear or apple slices with natural almond butter'
    ],
    avoidFoods: [
      'Ultra-processed snacks with trans fats and high sodium',
      'Sugar-sweetened beverages, sodas, and energy drinks',
      'Deep-fried fast food items and refined white flour pastries'
    ],
    healthyFoods: [
      'Dark leafy greens (spinach, kale, arugula)',
      'Omega-3 rich foods (salmon, chia seeds, walnuts)',
      'Fermented foods (kefir, plain yogurt, sauerkraut) for gut microbiome support',
      'Cruciferous vegetables (broccoli, cauliflower, Brussels sprouts)'
    ],
    proteinTips: 'Target 1.2 to 1.6 grams of high-quality protein per kilogram of body weight spread evenly across meals to preserve lean mass.',
    fiberTips: 'Aim for at least 30 grams of dietary fiber daily through whole grains, legumes, berries, and vegetables to support glycemic stability and cardiovascular health.',
    sugarReduction: 'Limit free added sugars to under 25 grams per day; replace artificial desserts with whole low-glycemic fruits.'
  };

  // Exercise Plan
  const exercisePlan = {
    beginner: [
      { name: 'Brisk Outdoor Walking', duration: '30 mins', caloriesBurned: '140-180 kcal', frequency: '5 days/week', difficulty: 'Low' },
      { name: 'Bodyweight Squats & Wall Push-ups', duration: '15 mins', caloriesBurned: '80-110 kcal', frequency: '3 days/week', difficulty: 'Low' },
      { name: 'Restorative Full-Body Stretching', duration: '15 mins', caloriesBurned: '50-70 kcal', frequency: 'Daily', difficulty: 'Low' }
    ],
    intermediate: [
      { name: 'Zone 2 Cardio (Jogging or Cycling)', duration: '45 mins', caloriesBurned: '300-400 kcal', frequency: '4 days/week', difficulty: 'Moderate' },
      { name: 'Dumbbell Full-Body Circuit Training', duration: '35 mins', caloriesBurned: '220-280 kcal', frequency: '3 days/week', difficulty: 'Moderate' },
      { name: 'Dynamic Core & Mobility Flow', duration: '20 mins', caloriesBurned: '100-140 kcal', frequency: '3 days/week', difficulty: 'Moderate' }
    ],
    advanced: [
      { name: 'High-Intensity Interval Training (HIIT)', duration: '30 mins', caloriesBurned: '320-450 kcal', frequency: '3 days/week', difficulty: 'High' },
      { name: 'Progressive Heavy Compound Resistance Training', duration: '50 mins', caloriesBurned: '350-480 kcal', frequency: '4 days/week', difficulty: 'High' },
      { name: 'Tempo Running / Incline Rucking', duration: '45 mins', caloriesBurned: '450-550 kcal', frequency: '2 days/week', difficulty: 'High' }
    ]
  };

  // Sleep Analysis
  const sleepAnalysis = {
    quality: sleepHours >= 7 && sleepHours <= 9 ? 'Optimal' : sleepHours < 6 ? 'Sub-optimal (Sleep Deprived)' : 'Fair',
    idealBedTime: lifestyle.bedTime || '22:30',
    idealWakeTime: lifestyle.wakeUpTime || '06:30',
    tips: [
      'Maintain a consistent sleep-wake schedule 7 days a week to anchor your circadian rhythm.',
      'Cease all blue light screen exposure at least 60 minutes before bedtime.',
      'Keep your sleep environment dark, quiet, and cool (approximately 18°C / 65°F).',
      'Avoid caffeine consumption within 8 hours of scheduled sleep.'
    ]
  };

  // Hydration Analysis
  const recWater = calculations.dailyWaterRequirement || 2.8;
  const currentWater = dailyWater;
  const remainingWater = Math.max(0, Number((recWater - currentWater).toFixed(1)));
  const hydrationAnalysis = {
    goal: recWater,
    current: currentWater,
    remaining: remainingWater,
    tips: [
      'Drink 500 mL of water immediately upon waking to replenish nocturnal metabolic fluid loss.',
      'Keep a reusable stainless steel water bottle at your workstation as a visual intake cue.',
      'Add electrolyte-rich foods or a pinch of mineral sea salt during intense workouts or warm weather.',
      'Monitor urine color aiming for a pale straw hue throughout the day.'
    ]
  };

  // Stress Management
  const stressManagement = [
    'Practice 5 minutes of box breathing (4s in, 4s hold, 4s out, 4s hold) during peak afternoon stress.',
    'Incorporate a 15-minute nature walk without smartphone distractions daily.',
    'Establish dedicated boundary hours separating professional tasks from personal rejuvenation.',
    'Engage in journaling or mindful gratitude practice before evening rest.'
  ];

  // Lifestyle Improvements
  const lifestyleImprovements = [
    'Take a 2-minute posture and micro-movement break every 45 minutes of sedentary desk work.',
    'Spend 10-15 minutes in direct morning sunlight to optimize natural cortisol rhythm and vitamin D synthesis.',
    'Gradually increase daily walking baseline by 1,000 steps weekly until reaching 10,000 steps.',
    'Replace evening screen time with relaxing physical reading or light stretching.'
  ];

  // Weekly Goals
  const weeklyGoals = [
    `Achieve minimum ${calculations.dailyWaterRequirement || 2.5} Liters of clean water daily for 7 days.`,
    'Complete at least 150 minutes of moderate-intensity physical activity this week.',
    'Ensure 7+ hours of uninterrupted restorative sleep every night.',
    'Consume at least 5 distinct colorful vegetable varieties across weekly meals.'
  ];

  // Preventive Advice
  const preventiveHealthAdvice = [
    'Schedule routine annual comprehensive metabolic and lipid panel blood tests.',
    'Monitor resting blood pressure monthly and maintain a home log.',
    'Stay current with age-appropriate immunization and preventive screening benchmarks.',
    'Maintain proactive dental hygiene and semi-annual clinical dental cleanings.'
  ];

  const medicalCheckupSuggestions = [
    'Complete Blood Count (CBC) & Comprehensive Metabolic Panel (CMP)',
    'Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)',
    'Fasting Blood Glucose and HbA1c screening',
    'Resting Blood Pressure and Cardiovascular Baseline Review',
    'Serum 25-Hydroxy Vitamin D and Thyroid Stimulating Hormone (TSH) test'
  ];

  const whenToVisitDoctor = symptoms.length > 0
    ? `You reported symptoms including ${symptoms.slice(0, 3).join(', ')}. Please schedule an in-person consultation with a licensed physician to thoroughly evaluate these findings.`
    : 'Schedule an appointment with a healthcare provider if you experience persistent unexplained fatigue, unexpected weight changes, chest tightness, shortness of breath, or chronic digestive discomfort.';

  return {
    overallHealthSummary,
    healthScore,
    riskFactors,
    dietPlan,
    exercisePlan,
    sleepAnalysis,
    hydrationAnalysis,
    stressManagement,
    lifestyleImprovements,
    weeklyGoals,
    preventiveHealthAdvice,
    medicalCheckupSuggestions,
    whenToVisitDoctor
  };
};

export const analyzeHealth = async (assessmentData: any) => {
  // Check if Gemini is configured
  if (!hasGeminiConfigured()) {
    return generateSmartClinicalAnalysis(assessmentData);
  }

  const client = getGeminiClient();
  if (!client) {
    return generateSmartClinicalAnalysis(assessmentData);
  }

  const prompt = `${SYSTEM_PROMPT}\nAnalyze the following comprehensive health assessment data and provide a valid JSON object matching this schema exactly (do not include markdown codeblocks or extra text, just clean JSON):
{
  "overallHealthSummary": "string",
  "healthScore": number,
  "riskFactors": ["string"],
  "dietPlan": {
    "breakfast": ["string"],
    "lunch": ["string"],
    "dinner": ["string"],
    "snacks": ["string"],
    "avoidFoods": ["string"],
    "healthyFoods": ["string"],
    "proteinTips": "string",
    "fiberTips": "string",
    "sugarReduction": "string"
  },
  "exercisePlan": {
    "beginner": [{"name":"string","duration":"string","caloriesBurned":"string","frequency":"string","difficulty":"string"}],
    "intermediate": [{"name":"string","duration":"string","caloriesBurned":"string","frequency":"string","difficulty":"string"}],
    "advanced": [{"name":"string","duration":"string","caloriesBurned":"string","frequency":"string","difficulty":"string"}]
  },
  "sleepAnalysis": { "quality": "string", "idealBedTime": "string", "idealWakeTime": "string", "tips": ["string"] },
  "hydrationAnalysis": { "goal": number, "current": number, "remaining": number, "tips": ["string"] },
  "stressManagement": ["string"],
  "lifestyleImprovements": ["string"],
  "weeklyGoals": ["string"],
  "preventiveHealthAdvice": ["string"],
  "medicalCheckupSuggestions": ["string"],
  "whenToVisitDoctor": "string"
}
\nAssessment Data: ${JSON.stringify(assessmentData)}`;

  // Try calling Gemini API with automatic retry
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          responseMimeType: 'application/json'
        }
      });
      
      const rawText = result.response.text();
      const sanitized = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(sanitized);
      
      if (parsed && parsed.overallHealthSummary && parsed.dietPlan) {
        return parsed;
      }
    } catch (error: any) {
      console.warn(`[Gemini] Health Analysis Attempt ${attempt} failed:`, error?.message || error);
      if (attempt === 2) {
        // Fallback gracefully on 2nd failure
        console.log('[Gemini] Activating Smart Clinical Analysis fallback engine');
        return generateSmartClinicalAnalysis(assessmentData);
      }
    }
  }

  return generateSmartClinicalAnalysis(assessmentData);
};

export const chatResponse = async (messages: any[], userMessage: string) => {
  if (!hasGeminiConfigured()) {
    return generateFallbackChatResponse(userMessage);
  }

  const client = getGeminiClient();
  if (!client) {
    return generateFallbackChatResponse(userMessage);
  }

  const history = messages
    .filter(m => m && m.content)
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const chat = model.startChat({
        history,
        generationConfig: { temperature: 0.7 }
      });

      const prompt = `${SYSTEM_PROMPT}\nUser: ${userMessage}`;
      const result = await chat.sendMessage(prompt);
      let text = result.response.text();
      if (!text.includes(DISCLAIMER)) {
        text += `\n\n${DISCLAIMER}`;
      }
      return text;
    } catch (error: any) {
      console.warn(`[Gemini] Chat Attempt ${attempt} failed:`, error?.message || error);
      if (attempt === 2) {
        return generateFallbackChatResponse(userMessage);
      }
    }
  }

  return generateFallbackChatResponse(userMessage);
};

const generateFallbackChatResponse = (userMessage: string): string => {
  const query = userMessage.toLowerCase();
  let advice = '';

  if (query.includes('diet') || query.includes('food') || query.includes('eat') || query.includes('nutrition')) {
    advice = 'A balanced preventive nutrition plan focuses on whole foods, lean proteins (poultry, fish, legumes), fiber-rich grains, and abundant colorful vegetables. Limiting ultra-processed items and excess refined sugar helps maintain stable blood glucose and energy levels.';
  } else if (query.includes('exercise') || query.includes('workout') || query.includes('fitness') || query.includes('steps')) {
    advice = 'The World Health Organization recommends at least 150–300 minutes of moderate-intensity aerobic physical activity per week, complemented by muscle-strengthening activities on 2 or more days. Aim for progressive consistency over extreme exertion.';
  } else if (query.includes('sleep') || query.includes('tired') || query.includes('insomnia') || query.includes('bed')) {
    advice = 'Quality sleep of 7–9 hours nightly is essential for cellular repair and cardiovascular regulation. Keeping a consistent bedtime, avoiding screens 60 minutes before rest, and keeping your bedroom dark and cool will significantly improve sleep architecture.';
  } else if (query.includes('water') || query.includes('hydrate') || query.includes('drink')) {
    advice = 'Adequate daily hydration (typically 2.5–3.5 Liters depending on activity and body size) supports cellular metabolism, cognitive alertness, and kidney function. Track your intake and drink water consistently across the day.';
  } else if (query.includes('stress') || query.includes('anxiety') || query.includes('calm')) {
    advice = 'Chronic stress elevates cortisol and blood pressure. Evidence-based relief includes slow diaphragmatic breathing (e.g. 4-7-8 breathing), daily outdoor nature walks, mindfulness practice, and maintaining structured work-rest boundaries.';
  } else {
    advice = `Thank you for reaching out regarding "${userMessage}". For optimal preventive health, prioritize consistent daily movement, whole-food nutrition, adequate hydration, and 7-8 hours of restful sleep. If you have specific medical symptoms or persistent conditions, consult your doctor.`;
  }

  return `${advice}\n\n${DISCLAIMER}`;
};

import fs from 'fs';
import { IStructuredReportAnalysis } from '../models/Report.js';

export const analyzeMedicalReport = async (
  fileName: string, 
  fileType: string, 
  filePath?: string
): Promise<{ summary: string; structuredAnalysis: IStructuredReportAnalysis }> => {
  const defaultFallback: IStructuredReportAnalysis = {
    summary: `Report "${fileName}" has been recorded. This educational overview outlines potential markers to review with a qualified healthcare professional.`,
    importantFindings: [`Uploaded file: ${fileName} (${fileType})`],
    abnormalValues: [],
    normalValues: [],
    possibleConcerns: ['Always discuss test results with a medical provider for clinical context.'],
    questionsForDoctor: [
      'What do these specific laboratory markers indicate regarding my baseline health?',
      'Are there any follow-up blood tests or lifestyle modifications you recommend?'
    ],
    recommendedFollowUp: ['Schedule a follow-up consultation with your doctor to review findings.'],
    importantDates: [new Date().toLocaleDateString()]
  };

  if (!hasGeminiConfigured()) {
    return {
      summary: defaultFallback.summary + `\n\n${DISCLAIMER}`,
      structuredAnalysis: defaultFallback
    };
  }

  const client = getGeminiClient();
  if (!client) {
    return {
      summary: defaultFallback.summary + `\n\n${DISCLAIMER}`,
      structuredAnalysis: defaultFallback
    };
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Prepare prompt with strict safety instructions
    const promptText = `You are GeneGuard AI, an educational preventive healthcare assistant. 
CRITICAL MEDICAL SAFETY RULES:
1. You are NOT diagnosing any disease or medical condition.
2. Use cautious, educational phrasing such as "Potential finding", "Possible concern", "Discuss with a healthcare professional".
3. Never invent or hallucinate clinical numbers. Only reference actual markers present in the report or standard reference ranges for this report type.
4. Always emphasize that this analysis is for educational purposes only.

Analyze the uploaded medical report titled "${fileName}" (type: ${fileType}).

Return a clean, valid JSON object matching this schema exactly without markdown formatting:
{
  "summary": "Educational summary of the report",
  "importantFindings": ["Key finding 1", "Key finding 2"],
  "abnormalValues": ["Potential elevated/low marker 1", "Potential marker 2"],
  "normalValues": ["Values within standard reference range"],
  "possibleConcerns": ["Possible area of concern to discuss with physician"],
  "questionsForDoctor": ["Question 1 to ask a doctor", "Question 2 to ask a doctor"],
  "recommendedFollowUp": ["Recommended follow-up step"],
  "importantDates": ["Date mentioned in report or date of review"]
}`;

    const parts: any[] = [{ text: promptText }];

    // If file exists and is image or PDF, attach as inline data if readable
    if (filePath && fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Data = fileBuffer.toString('base64');
        const mime = fileType.includes('pdf') ? 'application/pdf' : fileType;
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mime
          }
        });
      } catch (fileErr) {
        console.warn('[Gemini] File buffer attachment skipped:', fileErr);
      }
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: { 
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    });

    const rawText = result.response.text();
    const sanitized = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(sanitized);

    const structuredAnalysis: IStructuredReportAnalysis = {
      summary: parsed.summary || defaultFallback.summary,
      importantFindings: Array.isArray(parsed.importantFindings) ? parsed.importantFindings : defaultFallback.importantFindings,
      abnormalValues: Array.isArray(parsed.abnormalValues) ? parsed.abnormalValues : [],
      normalValues: Array.isArray(parsed.normalValues) ? parsed.normalValues : [],
      possibleConcerns: Array.isArray(parsed.possibleConcerns) ? parsed.possibleConcerns : defaultFallback.possibleConcerns,
      questionsForDoctor: Array.isArray(parsed.questionsForDoctor) ? parsed.questionsForDoctor : defaultFallback.questionsForDoctor,
      recommendedFollowUp: Array.isArray(parsed.recommendedFollowUp) ? parsed.recommendedFollowUp : defaultFallback.recommendedFollowUp,
      importantDates: Array.isArray(parsed.importantDates) ? parsed.importantDates : defaultFallback.importantDates
    };

    let summary = structuredAnalysis.summary;
    if (!summary.includes(DISCLAIMER)) {
      summary += `\n\nThis AI-generated summary is for educational purposes only and is not a medical diagnosis. Always discuss lab results with a qualified healthcare professional.`;
    }

    return { summary, structuredAnalysis };
  } catch (error) {
    console.error('Gemini structured report analysis error:', error);
    return {
      summary: defaultFallback.summary + `\n\n${DISCLAIMER}`,
      structuredAnalysis: defaultFallback
    };
  }
};

export const analyzeReport = async (fileName: string, fileType: string, filePath?: string) => {
  const result = await analyzeMedicalReport(fileName, fileType, filePath);
  return result.summary;
};

export const generateRecommendations = async (assessmentData: any) => {
  if (!assessmentData) {
    return ['Please complete a health assessment first to receive personalized recommendations.'];
  }
  
  if (!hasGeminiConfigured()) {
    const analysis = generateSmartClinicalAnalysis(assessmentData);
    return [
      ...analysis.lifestyleImprovements.slice(0, 3),
      ...analysis.dietPlan.healthyFoods.slice(0, 2)
    ];
  }

  const client = getGeminiClient();
  if (!client) {
    const analysis = generateSmartClinicalAnalysis(assessmentData);
    return analysis.lifestyleImprovements;
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${SYSTEM_PROMPT}\nGenerate 5 actionable daily preventive health tips based on this assessment data: ${JSON.stringify(assessmentData)}. Return a JSON array of strings only.`;
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, responseMimeType: 'application/json' }
    });
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini recommendations error:', error);
    const analysis = generateSmartClinicalAnalysis(assessmentData);
    return analysis.lifestyleImprovements;
  }
};

export const generateWeeklyGoals = async (assessmentData: any) => {
  if (!assessmentData) {
    return ['Please complete a health assessment first to receive personalized weekly goals.'];
  }

  if (!hasGeminiConfigured()) {
    const analysis = generateSmartClinicalAnalysis(assessmentData);
    return analysis.weeklyGoals;
  }

  const client = getGeminiClient();
  if (!client) {
    const analysis = generateSmartClinicalAnalysis(assessmentData);
    return analysis.weeklyGoals;
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${SYSTEM_PROMPT}\nGenerate 4 concrete weekly health goals based on this assessment data: ${JSON.stringify(assessmentData)}. Return a JSON array of strings only.`;
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, responseMimeType: 'application/json' }
    });
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini goals error:', error);
    const analysis = generateSmartClinicalAnalysis(assessmentData);
    return analysis.weeklyGoals;
  }
};