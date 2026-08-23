export interface SafetyCheckResult {
  isEmergency: boolean;
  emergencyType?: 'cardiac' | 'stroke' | 'respiratory' | 'anaphylaxis' | 'self_harm' | 'severe_acute';
  emergencyMessage?: string;
  flaggedKeywords: string[];
  safeAdvice?: string;
}

export const CLINICAL_DISCLAIMER = 'GeneGuard AI provides educational wellness insights only. It is not a medical diagnosis. Always consult a qualified healthcare professional or seek emergency medical care for acute symptoms.';

// High-risk emergency keywords and symptom patterns
const EMERGENCY_PATTERNS: Array<{
  type: 'cardiac' | 'stroke' | 'respiratory' | 'anaphylaxis' | 'self_harm' | 'severe_acute';
  regex: RegExp;
  guidance: string;
}> = [
  {
    type: 'cardiac',
    regex: /(chest pain|crushing chest|radiating to (left arm|jaw|neck)|heart attack|tightness in chest|severe chest pressure)/i,
    guidance: 'CRITICAL WARNING: Chest pain or pressure radiating to the arm, neck, or jaw may indicate an acute cardiovascular emergency (heart attack). Call emergency services (911 / 112 / 999) or proceed immediately to the nearest Emergency Room.'
  },
  {
    type: 'stroke',
    regex: /(face drooping|facial droop|arm weakness|slurred speech|sudden loss of vision|sudden numbness on one side|FAST stroke)/i,
    guidance: 'CRITICAL WARNING: Sudden facial droop, arm weakness, or slurred speech are key signs of a stroke. Time is critical: Call emergency medical dispatch immediately.'
  },
  {
    type: 'respiratory',
    regex: /(can't breathe|cannot breathe|severe shortness of breath|gasping for air|turning blue|suffocating|choking)/i,
    guidance: 'CRITICAL WARNING: Severe respiratory distress or inability to breathe requires immediate emergency medical attention. Call emergency services now.'
  },
  {
    type: 'anaphylaxis',
    regex: /(anaphylaxis|throat closing|swelling of (lips|tongue|throat)|severe allergic reaction|injected epi)/i,
    guidance: 'CRITICAL WARNING: Symptoms of acute anaphylaxis (throat swelling, difficulty breathing) are life-threatening. Administer an EpiPen if prescribed and dial emergency services immediately.'
  },
  {
    type: 'self_harm',
    regex: /(suicide|kill myself|end my life|want to die|self harm|overdose)/i,
    guidance: 'CRITICAL SUPPORT: If you or someone you know is in distress or considering self-harm, please reach out for immediate support. Call or text 988 (Suicide & Crisis Lifeline) or your local crisis helpline.'
  },
  {
    type: 'severe_acute',
    regex: /(coughing up (large amounts of )?blood|vomiting blood|unconscious|unresponsive|severe head trauma|heavy bleeding)/i,
    guidance: 'CRITICAL WARNING: Severe acute bleeding or altered consciousness requires urgent emergency medical intervention. Call emergency dispatch immediately.'
  }
];

export function checkAISafety(input: string): SafetyCheckResult {
  const text = (input || '').trim();
  const flaggedKeywords: string[] = [];

  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.regex.test(text)) {
      const matches = text.match(pattern.regex);
      if (matches) {
        flaggedKeywords.push(matches[0]);
      }
      return {
        isEmergency: true,
        emergencyType: pattern.type,
        emergencyMessage: pattern.guidance,
        flaggedKeywords,
        safeAdvice: `${pattern.guidance}\n\n${CLINICAL_DISCLAIMER}`
      };
    }
  }

  return {
    isEmergency: false,
    flaggedKeywords: []
  };
}

export function enforceDisclaimer(text: string): string {
  if (!text) return CLINICAL_DISCLAIMER;
  if (text.includes(CLINICAL_DISCLAIMER)) return text;
  return `${text.trim()}\n\n${CLINICAL_DISCLAIMER}`;
}
