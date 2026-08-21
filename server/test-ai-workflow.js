// Automated test script for AI Analysis Workflow
import { analyzeHealth, generateSmartClinicalAnalysis, chatResponse } from './dist/services/gemini.service.js';

async function runAITests() {
  console.log('--- Starting AI Health Analysis Workflow Tests ---');
  let passed = 0;
  let failed = 0;

  const mockAssessmentData = {
    personalInfo: {
      name: 'John Doe',
      age: 32,
      gender: 'male',
      height: 178,
      weight: 74,
      bloodGroup: 'O+'
    },
    lifestyle: {
      smoking: 'no',
      alcohol: 'occasionally',
      dailyWaterIntake: 2.2,
      sleepHours: 7.5,
      wakeUpTime: '06:30',
      bedTime: '23:00',
      dailyScreenTime: 6,
      stressLevel: 4,
      occupation: 'Software Engineer',
      workingHours: 8
    },
    physicalActivity: {
      dailyWalkingMinutes: 45,
      stepsPerDay: 8500,
      exerciseFrequency: '3-4 times/week',
      exerciseType: 'Running and bodyweight',
      workoutDuration: 40
    },
    nutrition: {
      mealsPerDay: 3,
      fruitsPerWeek: 7,
      vegetablesPerWeek: 12,
      fastFoodFrequency: 'once a week',
      sugarIntake: 'low',
      waterIntake: 8
    },
    medicalHistory: {
      allergies: 'Pollen'
    },
    familyHistory: {
      diabetes: false,
      heartDisease: false
    },
    symptoms: []
  };

  // Test 1: Smart Clinical Fallback Analysis Generation
  try {
    const clinicalAnalysis = generateSmartClinicalAnalysis(mockAssessmentData);
    if (
      clinicalAnalysis.overallHealthSummary &&
      typeof clinicalAnalysis.healthScore === 'number' &&
      Array.isArray(clinicalAnalysis.riskFactors) &&
      clinicalAnalysis.dietPlan?.breakfast?.length > 0 &&
      clinicalAnalysis.exercisePlan?.beginner?.length > 0 &&
      clinicalAnalysis.sleepAnalysis?.quality &&
      clinicalAnalysis.hydrationAnalysis?.goal &&
      Array.isArray(clinicalAnalysis.stressManagement) &&
      Array.isArray(clinicalAnalysis.lifestyleImprovements) &&
      Array.isArray(clinicalAnalysis.weeklyGoals) &&
      Array.isArray(clinicalAnalysis.preventiveHealthAdvice) &&
      Array.isArray(clinicalAnalysis.medicalCheckupSuggestions) &&
      typeof clinicalAnalysis.whenToVisitDoctor === 'string'
    ) {
      console.log('✅ Test 1 Passed: Smart Clinical Fallback generates all required structured JSON fields');
      passed++;
    } else {
      console.error('❌ Test 1 Failed: Missing required fields in clinical analysis');
      failed++;
    }
  } catch (err) {
    console.error('❌ Test 1 Threw Error:', err);
    failed++;
  }

  // Test 2: analyzeHealth Service execution
  try {
    const analysis = await analyzeHealth(mockAssessmentData);
    if (
      analysis &&
      analysis.overallHealthSummary &&
      analysis.dietPlan?.breakfast &&
      analysis.exercisePlan?.beginner &&
      analysis.whenToVisitDoctor
    ) {
      console.log('✅ Test 2 Passed: analyzeHealth returns valid structured AI analysis');
      passed++;
    } else {
      console.error('❌ Test 2 Failed: analyzeHealth did not return expected structure');
      failed++;
    }
  } catch (err) {
    console.error('❌ Test 2 Threw Error:', err);
    failed++;
  }

  // Test 3: chatResponse returns structured text with medical disclaimer
  try {
    const chat = await chatResponse([], 'What should I eat for breakfast?');
    if (chat && chat.includes('GeneGuard AI provides educational wellness insights only')) {
      console.log('✅ Test 3 Passed: chatResponse includes mandatory medical disclaimer');
      passed++;
    } else {
      console.error('❌ Test 3 Failed: chatResponse missing disclaimer or content');
      failed++;
    }
  } catch (err) {
    console.error('❌ Test 3 Threw Error:', err);
    failed++;
  }

  // Test 4: Verify NO technical error exposure in responses
  try {
    const clinicalAnalysis = generateSmartClinicalAnalysis(mockAssessmentData);
    const serialized = JSON.stringify(clinicalAnalysis);
    if (!serialized.includes('Gemini API key') && !serialized.includes('API_KEY_INVALID')) {
      console.log('✅ Test 4 Passed: No technical Gemini API error messages exposed to user');
      passed++;
    } else {
      console.error('❌ Test 4 Failed: Technical key error found in output');
      failed++;
    }
  } catch (err) {
    console.error('❌ Test 4 Threw Error:', err);
    failed++;
  }

  console.log(`\n--- Test Summary: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
}

runAITests();
