import express from 'express';
import { createAssessmentValidator } from './dist/validators/assessment.validator.js';
import { registerValidator, loginValidator } from './dist/validators/auth.validator.js';
import { validate } from './dist/middleware/validate.js';

const app = express();
app.use(express.json());

app.post('/test/assessment', createAssessmentValidator, validate, (req, res) => {
  res.json({ success: true, data: req.body });
});

app.post('/test/register', registerValidator, validate, (req, res) => {
  res.json({ success: true, data: req.body });
});

app.post('/test/login', loginValidator, validate, (req, res) => {
  res.json({ success: true, data: req.body });
});

const validAssessment = {
  personalInfo: {
    name: 'Jane Doe',
    age: 28,
    gender: 'female',
    height: 165,
    weight: 60,
    bloodGroup: 'O+'
  },
  lifestyle: {
    smoking: 'no',
    alcohol: 'occasionally',
    dailyWaterIntake: 2.5,
    sleepHours: 7.5,
    wakeUpTime: '06:30',
    bedTime: '23:00',
    dailyScreenTime: 6,
    stressLevel: 4,
    occupation: 'Doctor',
    workingHours: 8
  },
  physicalActivity: {
    dailyWalkingMinutes: 45,
    stepsPerDay: 8000,
    exerciseFrequency: '3-4 times/week',
    exerciseType: 'Jogging',
    workoutDuration: 40
  },
  nutrition: {
    mealsPerDay: 3,
    fruitsPerWeek: 7,
    vegetablesPerWeek: 10,
    fastFoodFrequency: 'once a week',
    sugarIntake: 'moderate',
    waterIntake: 8
  },
  medicalHistory: { diabetes: false },
  familyHistory: { diabetes: false },
  symptoms: []
};

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  console.log(`=== RUNNING COMPREHENSIVE VALIDATION TESTS ON PORT ${port} ===\n`);
  let passed = 0;
  let failed = 0;

  async function assertCase(name, endpoint, payload, shouldPass, expectedField) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const pass = shouldPass ? res.status === 200 : res.status === 400;
    
    if (pass) {
      if (!shouldPass && expectedField) {
        const hasField = data.errors?.some(e => e.field === expectedField || e.field.includes(expectedField));
        if (hasField) {
          console.log(`✅ PASS: ${name} -> Correctly rejected on field '${expectedField}' (Message: "${data.message}")`);
          passed++;
        } else {
          console.log(`❌ FAIL: ${name} -> Rejected with 400, but field '${expectedField}' not in errors:`, data.errors);
          failed++;
        }
      } else {
        console.log(`✅ PASS: ${name} -> Status ${res.status}`);
        passed++;
      }
    } else {
      console.log(`❌ FAIL: ${name} -> Expected status ${shouldPass ? 200 : 400}, got ${res.status}:`, data);
      failed++;
    }
  }

  try {
    // 1. Valid Payload
    await assertCase('Valid Assessment Payload', '/test/assessment', validAssessment, true);

    // 2. Age tests
    await assertCase('Reject Age = 0', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, age: 0 }
    }, false, 'personalInfo.age');

    await assertCase('Reject Negative Age (-5)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, age: -5 }
    }, false, 'personalInfo.age');

    await assertCase('Reject Decimal Age (25.5)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, age: '25.5' }
    }, false, 'personalInfo.age');

    await assertCase('Reject Unrealistic Age (150)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, age: 150 }
    }, false, 'personalInfo.age');

    // 3. Height tests
    await assertCase('Reject Height = 0', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, height: 0 }
    }, false, 'personalInfo.height');

    await assertCase('Reject Negative Height (-10)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, height: -10 }
    }, false, 'personalInfo.height');

    await assertCase('Reject Unrealistic Height (30 cm)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, height: 30 }
    }, false, 'personalInfo.height');

    await assertCase('Reject Unrealistic Height (300 cm)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, height: 300 }
    }, false, 'personalInfo.height');

    // 4. Weight tests
    await assertCase('Reject Weight = 0', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, weight: 0 }
    }, false, 'personalInfo.weight');

    await assertCase('Reject Negative Weight (-20)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, weight: -20 }
    }, false, 'personalInfo.weight');

    await assertCase('Reject Unrealistic Weight (5 kg)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, weight: 5 }
    }, false, 'personalInfo.weight');

    await assertCase('Reject Unrealistic Weight (600 kg)', '/test/assessment', {
      ...validAssessment, personalInfo: { ...validAssessment.personalInfo, weight: 600 }
    }, false, 'personalInfo.weight');

    // 5. Water Intake tests
    await assertCase('Reject Daily Water Intake = 0', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, dailyWaterIntake: 0 }
    }, false, 'lifestyle.dailyWaterIntake');

    await assertCase('Reject Negative Daily Water Intake (-2)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, dailyWaterIntake: -2 }
    }, false, 'lifestyle.dailyWaterIntake');

    await assertCase('Reject Excessive Daily Water Intake (15 L)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, dailyWaterIntake: 15 }
    }, false, 'lifestyle.dailyWaterIntake');

    // 6. Sleep Hours tests
    await assertCase('Reject Negative Sleep Hours (-1)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, sleepHours: -1 }
    }, false, 'lifestyle.sleepHours');

    await assertCase('Reject Excessive Sleep Hours (25 hrs)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, sleepHours: 25 }
    }, false, 'lifestyle.sleepHours');

    // 7. Screen Time tests
    await assertCase('Reject Negative Screen Time (-2)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, dailyScreenTime: -2 }
    }, false, 'lifestyle.dailyScreenTime');

    await assertCase('Reject Excessive Screen Time (26 hrs)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, dailyScreenTime: 26 }
    }, false, 'lifestyle.dailyScreenTime');

    // 8. Workout Duration tests
    await assertCase('Reject Negative Workout Duration (-15)', '/test/assessment', {
      ...validAssessment, physicalActivity: { ...validAssessment.physicalActivity, workoutDuration: -15 }
    }, false, 'physicalActivity.workoutDuration');

    await assertCase('Reject Excessive Workout Duration (350 min)', '/test/assessment', {
      ...validAssessment, physicalActivity: { ...validAssessment.physicalActivity, workoutDuration: 350 }
    }, false, 'physicalActivity.workoutDuration');

    // 9. Daily Walking Minutes tests
    await assertCase('Reject Negative Walking Minutes (-10)', '/test/assessment', {
      ...validAssessment, physicalActivity: { ...validAssessment.physicalActivity, dailyWalkingMinutes: -10 }
    }, false, 'physicalActivity.dailyWalkingMinutes');

    await assertCase('Reject Excessive Walking Minutes (700 min)', '/test/assessment', {
      ...validAssessment, physicalActivity: { ...validAssessment.physicalActivity, dailyWalkingMinutes: 700 }
    }, false, 'physicalActivity.dailyWalkingMinutes');

    // 10. Steps Per Day tests
    await assertCase('Reject Negative Steps (-1000)', '/test/assessment', {
      ...validAssessment, physicalActivity: { ...validAssessment.physicalActivity, stepsPerDay: -1000 }
    }, false, 'physicalActivity.stepsPerDay');

    await assertCase('Reject Excessive Steps (150,000)', '/test/assessment', {
      ...validAssessment, physicalActivity: { ...validAssessment.physicalActivity, stepsPerDay: 150000 }
    }, false, 'physicalActivity.stepsPerDay');

    // 11. Stress Level tests
    await assertCase('Reject Stress Level = 0', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, stressLevel: 0 }
    }, false, 'lifestyle.stressLevel');

    await assertCase('Reject Stress Level = 11', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, stressLevel: 11 }
    }, false, 'lifestyle.stressLevel');

    // 12. Meals Per Day tests
    await assertCase('Reject Meals Per Day = 0', '/test/assessment', {
      ...validAssessment, nutrition: { ...validAssessment.nutrition, mealsPerDay: 0 }
    }, false, 'nutrition.mealsPerDay');

    await assertCase('Reject Meals Per Day = 12', '/test/assessment', {
      ...validAssessment, nutrition: { ...validAssessment.nutrition, mealsPerDay: 12 }
    }, false, 'nutrition.mealsPerDay');

    // 13. Working Hours tests
    await assertCase('Reject Negative Working Hours (-4)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, workingHours: -4 }
    }, false, 'lifestyle.workingHours');

    await assertCase('Reject Excessive Working Hours (25 hrs)', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, workingHours: 25 }
    }, false, 'lifestyle.workingHours');

    // 14. Time Format tests
    await assertCase('Reject Invalid Wake Up Time ("25:00")', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, wakeUpTime: '25:00' }
    }, false, 'lifestyle.wakeUpTime');

    await assertCase('Reject Invalid Bed Time ("not-a-time")', '/test/assessment', {
      ...validAssessment, lifestyle: { ...validAssessment.lifestyle, bedTime: 'not-a-time' }
    }, false, 'lifestyle.bedTime');

    // 15. Auth tests
    await assertCase('Valid Register Payload', '/test/register', {
      name: 'Alice Wonder', email: 'alice@example.com', password: 'password123'
    }, true);

    await assertCase('Reject Invalid Email in Register', '/test/register', {
      name: 'Alice Wonder', email: 'alice-not-email', password: 'password123'
    }, false, 'email');

    await assertCase('Reject Short Password in Register', '/test/register', {
      name: 'Alice Wonder', email: 'alice@example.com', password: '123'
    }, false, 'password');

    await assertCase('Reject Empty Name in Register', '/test/register', {
      name: '   ', email: 'alice@example.com', password: 'password123'
    }, false, 'name');

  } finally {
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
