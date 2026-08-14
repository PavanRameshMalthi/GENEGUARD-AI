const { GoogleGenAI } = require('@google/genai');

// @desc    Analyze health data with Gemini
// @route   POST /api/ai/analyze
// @access  Private
const analyzeHealthData = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const assessmentData = req.body;

    const prompt = `
      You are an AI wellness assistant. Your role is to provide general wellness guidance and potential risk factors based on the user's data.
      CRITICAL RULE: You must NOT diagnose any disease or medical condition. Always include a disclaimer that this is not medical advice.
      
      User Data:
      ${JSON.stringify(assessmentData, null, 2)}
      
      Provide a JSON response with the following structure:
      {
        "healthScore": (number 0-100),
        "riskLevel": ("Low", "Medium", or "High"),
        "summary": (A brief summary of their overall wellness),
        "possibleRiskFactors": [(array of strings)],
        "lifestyleSuggestions": [(array of strings)],
        "dietRecommendations": [(array of strings)],
        "exerciseSuggestions": [(array of strings)],
        "sleepRecommendations": [(array of strings)],
        "hydrationAdvice": [(array of strings)],
        "mentalWellnessTips": [(array of strings)],
        "whenToConsultDoctor": (string advice on when to see a professional)
      }
      
      Ensure the response is valid JSON and nothing else (no markdown blocks around it if possible, or I will parse it out).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    let text = response.text;
    // Clean up markdown code blocks if any
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '');
    }

    const jsonResult = JSON.parse(text);
    res.json(jsonResult);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: 'Failed to analyze health data.' });
  }
};

// @desc    Chat with AI Health Assistant
// @route   POST /api/ai/chat
// @access  Private
const chatAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let formattedHistory = [];
    if (history && Array.isArray(history)) {
       formattedHistory = history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
       }));
    }

    const systemInstruction = "You are GeneGuard AI's wellness assistant. Provide general health and wellness tips. Never diagnose. Always state you are providing educational insights and they should consult a doctor for medical advice. Start your advice with phrases like 'Based on the information provided...' or 'Potential health considerations...'.";

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    // send past history? The SDK might handle history differently in create, but we can just pass the whole thing as a single prompt if needed, or use the chat session.
    // For simplicity, we just send the new message with context.
    const prompt = `User History: ${JSON.stringify(history)}\n\nUser Message: ${message}`;
    
    const response = await chat.sendMessage({ message: prompt });
    
    res.json({ text: response.text });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: 'Failed to get chat response.' });
  }
};

module.exports = { analyzeHealthData, chatAssistant };
