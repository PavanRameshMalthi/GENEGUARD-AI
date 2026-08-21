export function generateHealthReportHTML(assessment: any): string {
  const { personalInfo, lifestyle, physicalActivity, nutrition, medicalHistory, familyHistory, symptoms, calculations, aiAnalysis } = assessment;
  const date = new Date(assessment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GeneGuard AI - Health Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; line-height: 1.6; padding: 40px; max-width: 900px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #3b82f6; }
    .header h1 { color: #3b82f6; font-size: 28px; margin-bottom: 8px; }
    .header p { color: #6b7280; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #1e40af; font-size: 20px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
    .section h3 { color: #374151; font-size: 16px; margin-bottom: 8px; margin-top: 16px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
    .grid-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #e5e7eb; }
    .grid-item .label { color: #6b7280; }
    .grid-item .value { font-weight: 600; }
    .score-box { text-align: center; background: #eff6ff; border-radius: 12px; padding: 24px; margin: 16px 0; }
    .score-box .score { font-size: 48px; font-weight: 700; color: #3b82f6; }
    .score-box .label { color: #6b7280; font-size: 14px; }
    ul { padding-left: 20px; margin-top: 8px; }
    li { margin-bottom: 6px; color: #374151; }
    .disclaimer { margin-top: 40px; padding: 16px; background: #fef3c7; border-radius: 8px; font-size: 12px; color: #92400e; text-align: center; }
    .exercise-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .exercise-table th, .exercise-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .exercise-table th { background: #f3f4f6; font-weight: 600; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧬 GeneGuard AI Health Report</h1>
    <p>Generated on ${date} for ${personalInfo?.name || 'User'}</p>
  </div>

  <div class="section">
    <h2>📊 Assessment Summary</h2>
    <div class="score-box">
      <div class="score">${calculations?.healthScore ?? aiAnalysis?.healthScore ?? 'N/A'}</div>
      <div class="label">Overall Health Score (out of 100)</div>
    </div>
    <div class="grid">
      <div class="grid-item"><span class="label">BMI</span><span class="value">${calculations?.bmi ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">BMI Category</span><span class="value">${calculations?.bmiCategory ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Ideal Weight</span><span class="value">${calculations?.idealWeightMin ?? '?'} - ${calculations?.idealWeightMax ?? '?'} kg</span></div>
      <div class="grid-item"><span class="label">Calories Needed</span><span class="value">${calculations?.caloriesNeeded ?? 'N/A'} kcal/day</span></div>
      <div class="grid-item"><span class="label">Activity Level</span><span class="value">${calculations?.activityLevel ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Risk Level</span><span class="value">${calculations?.riskLevel ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Water Requirement</span><span class="value">${calculations?.dailyWaterRequirement ?? 'N/A'} L/day</span></div>
      <div class="grid-item"><span class="label">Recommended Sleep</span><span class="value">${calculations?.recommendedSleep ?? 'N/A'} hrs</span></div>
    </div>
  </div>

  <div class="section">
    <h2>🏥 Personal Information</h2>
    <div class="grid">
      <div class="grid-item"><span class="label">Age</span><span class="value">${personalInfo?.age ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Gender</span><span class="value">${personalInfo?.gender ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Height</span><span class="value">${personalInfo?.height ?? 'N/A'} cm</span></div>
      <div class="grid-item"><span class="label">Weight</span><span class="value">${personalInfo?.weight ?? 'N/A'} kg</span></div>
      <div class="grid-item"><span class="label">Blood Group</span><span class="value">${personalInfo?.bloodGroup ?? 'N/A'}</span></div>
    </div>
  </div>

  ${aiAnalysis?.overallHealthSummary ? `
  <div class="section">
    <h2>📋 AI Health Summary</h2>
    <p>${aiAnalysis.overallHealthSummary}</p>
  </div>` : ''}

  ${aiAnalysis?.riskFactors?.length ? `
  <div class="section">
    <h2>⚠️ Risk Factors</h2>
    <ul>${aiAnalysis.riskFactors.map((r: string) => `<li>${r}</li>`).join('')}</ul>
  </div>` : ''}

  ${aiAnalysis?.dietPlan ? `
  <div class="section">
    <h2>🥗 Diet Plan</h2>
    ${aiAnalysis.dietPlan.breakfast?.length ? `<h3>Breakfast</h3><ul>${aiAnalysis.dietPlan.breakfast.map((b: string) => `<li>${b}</li>`).join('')}</ul>` : ''}
    ${aiAnalysis.dietPlan.lunch?.length ? `<h3>Lunch</h3><ul>${aiAnalysis.dietPlan.lunch.map((l: string) => `<li>${l}</li>`).join('')}</ul>` : ''}
    ${aiAnalysis.dietPlan.dinner?.length ? `<h3>Dinner</h3><ul>${aiAnalysis.dietPlan.dinner.map((d: string) => `<li>${d}</li>`).join('')}</ul>` : ''}
    ${aiAnalysis.dietPlan.snacks?.length ? `<h3>Snacks</h3><ul>${aiAnalysis.dietPlan.snacks.map((s: string) => `<li>${s}</li>`).join('')}</ul>` : ''}
    ${aiAnalysis.dietPlan.avoidFoods?.length ? `<h3>Foods to Avoid</h3><ul>${aiAnalysis.dietPlan.avoidFoods.map((f: string) => `<li>${f}</li>`).join('')}</ul>` : ''}
    ${aiAnalysis.dietPlan.healthyFoods?.length ? `<h3>Healthy Foods</h3><ul>${aiAnalysis.dietPlan.healthyFoods.map((f: string) => `<li>${f}</li>`).join('')}</ul>` : ''}
  </div>` : ''}

  ${aiAnalysis?.exercisePlan ? `
  <div class="section">
    <h2>🏋️ Exercise Plan</h2>
    ${['beginner', 'intermediate', 'advanced'].map(level => {
      const exercises = aiAnalysis.exercisePlan[level];
      if (!exercises?.length) return '';
      return `
      <h3>${level.charAt(0).toUpperCase() + level.slice(1)}</h3>
      <table class="exercise-table">
        <thead><tr><th>Exercise</th><th>Duration</th><th>Calories</th><th>Frequency</th></tr></thead>
        <tbody>${exercises.map((e: any) => `<tr><td>${e.name}</td><td>${e.duration}</td><td>${e.caloriesBurned}</td><td>${e.frequency}</td></tr>`).join('')}</tbody>
      </table>`;
    }).join('')}
  </div>` : ''}

  ${aiAnalysis?.sleepAnalysis ? `
  <div class="section">
    <h2>😴 Sleep Analysis</h2>
    <div class="grid">
      <div class="grid-item"><span class="label">Sleep Quality</span><span class="value">${aiAnalysis.sleepAnalysis.quality ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Ideal Bed Time</span><span class="value">${aiAnalysis.sleepAnalysis.idealBedTime ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Ideal Wake Time</span><span class="value">${aiAnalysis.sleepAnalysis.idealWakeTime ?? 'N/A'}</span></div>
    </div>
    ${aiAnalysis.sleepAnalysis.tips?.length ? `<h3>Sleep Tips</h3><ul>${aiAnalysis.sleepAnalysis.tips.map((t: string) => `<li>${t}</li>`).join('')}</ul>` : ''}
  </div>` : ''}

  ${aiAnalysis?.hydrationAnalysis ? `
  <div class="section">
    <h2>💧 Hydration Analysis</h2>
    <div class="grid">
      <div class="grid-item"><span class="label">Daily Goal</span><span class="value">${aiAnalysis.hydrationAnalysis.goal ?? 'N/A'} L</span></div>
      <div class="grid-item"><span class="label">Current Intake</span><span class="value">${aiAnalysis.hydrationAnalysis.current ?? 'N/A'} L</span></div>
      <div class="grid-item"><span class="label">Remaining</span><span class="value">${aiAnalysis.hydrationAnalysis.remaining ?? 'N/A'} L</span></div>
    </div>
    ${aiAnalysis.hydrationAnalysis.tips?.length ? `<h3>Tips</h3><ul>${aiAnalysis.hydrationAnalysis.tips.map((t: string) => `<li>${t}</li>`).join('')}</ul>` : ''}
  </div>` : ''}

  ${aiAnalysis?.lifestyleImprovements?.length ? `
  <div class="section">
    <h2>🌟 Lifestyle Improvements</h2>
    <ul>${aiAnalysis.lifestyleImprovements.map((l: string) => `<li>${l}</li>`).join('')}</ul>
  </div>` : ''}

  ${aiAnalysis?.weeklyGoals?.length ? `
  <div class="section">
    <h2>🎯 Weekly Goals</h2>
    <ul>${aiAnalysis.weeklyGoals.map((g: string) => `<li>${g}</li>`).join('')}</ul>
  </div>` : ''}

  ${aiAnalysis?.preventiveHealthAdvice?.length ? `
  <div class="section">
    <h2>🛡️ Preventive Health Advice</h2>
    <ul>${aiAnalysis.preventiveHealthAdvice.map((a: string) => `<li>${a}</li>`).join('')}</ul>
  </div>` : ''}

  ${aiAnalysis?.medicalCheckupSuggestions?.length ? `
  <div class="section">
    <h2>🩺 Medical Checkup Suggestions</h2>
    <ul>${aiAnalysis.medicalCheckupSuggestions.map((c: string) => `<li>${c}</li>`).join('')}</ul>
  </div>` : ''}

  ${aiAnalysis?.whenToVisitDoctor ? `
  <div class="section">
    <h2>🚨 When to Visit a Doctor</h2>
    <p>${aiAnalysis.whenToVisitDoctor}</p>
  </div>` : ''}

  <div class="disclaimer">
    ⚠️ GeneGuard AI provides educational wellness insights only. It is not a medical diagnosis. Always consult a qualified healthcare professional.
  </div>
</body>
</html>`;
}
