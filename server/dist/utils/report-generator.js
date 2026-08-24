export function generateHealthReportHTML(assessment) {
    const { personalInfo, lifestyle, physicalActivity, nutrition, calculations, aiAnalysis } = assessment;
    const date = new Date(assessment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GeneGuard AI - Assessment Health Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 36px; max-width: 900px; margin: 0 auto; background: #fff; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0284c7; }
    .header h1 { color: #0284c7; font-size: 26px; margin-bottom: 6px; }
    .header p { color: #64748b; font-size: 13px; }
    .section { margin-bottom: 26px; }
    .section h2 { color: #0f172a; font-size: 18px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
    .section h3 { color: #334155; font-size: 15px; margin-bottom: 8px; margin-top: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
    .grid-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #e2e8f0; font-size: 13px; }
    .grid-item .label { color: #64748b; }
    .grid-item .value { font-weight: 600; color: #0f172a; }
    .score-box { text-align: center; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .score-box .score { font-size: 44px; font-weight: 800; color: #0284c7; }
    .score-box .label { color: #0369a1; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    ul { padding-left: 20px; margin-top: 6px; }
    li { margin-bottom: 4px; color: #334155; font-size: 13px; }
    .disclaimer { margin-top: 36px; padding: 14px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; font-size: 11px; color: #92400e; text-align: center; }
    .exercise-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .exercise-table th, .exercise-table td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .exercise-table th { background: #f8fafc; font-weight: 600; color: #475569; }
    @media print { body { padding: 15px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧬 GeneGuard AI — Clinical Wellness Report</h1>
    <p>Document Generated on ${date} for <strong>${personalInfo?.name || 'User'}</strong></p>
  </div>

  <div class="section">
    <h2>📊 Assessment Metrics & Risk Score</h2>
    <div class="score-box">
      <div class="score">${calculations?.healthScore ?? aiAnalysis?.healthScore ?? 'N/A'}</div>
      <div class="label">Overall Health Score (0–100)</div>
    </div>
    <div class="grid">
      <div class="grid-item"><span class="label">BMI</span><span class="value">${calculations?.bmi ?? 'N/A'} (${calculations?.bmiCategory ?? 'N/A'})</span></div>
      <div class="grid-item"><span class="label">Risk Level</span><span class="value">${calculations?.riskLevel ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Ideal Weight Range</span><span class="value">${calculations?.idealWeightMin ?? '?'} - ${calculations?.idealWeightMax ?? '?'} kg</span></div>
      <div class="grid-item"><span class="label">Daily Calorie Target</span><span class="value">${calculations?.caloriesNeeded ?? 'N/A'} kcal/day</span></div>
      <div class="grid-item"><span class="label">Hydration Target</span><span class="value">${calculations?.dailyWaterRequirement ?? 'N/A'} L/day</span></div>
      <div class="grid-item"><span class="label">Target Sleep Duration</span><span class="value">${calculations?.recommendedSleep ?? 'N/A'} hrs/night</span></div>
    </div>
  </div>

  <div class="section">
    <h2>🏥 Patient Demographics</h2>
    <div class="grid">
      <div class="grid-item"><span class="label">Age</span><span class="value">${personalInfo?.age ?? 'N/A'} yrs</span></div>
      <div class="grid-item"><span class="label">Gender</span><span class="value">${personalInfo?.gender ?? 'N/A'}</span></div>
      <div class="grid-item"><span class="label">Height / Weight</span><span class="value">${personalInfo?.height ?? 'N/A'} cm / ${personalInfo?.weight ?? 'N/A'} kg</span></div>
      <div class="grid-item"><span class="label">Blood Group</span><span class="value">${personalInfo?.bloodGroup ?? 'N/A'}</span></div>
    </div>
  </div>

  ${aiAnalysis?.overallHealthSummary ? `
  <div class="section">
    <h2>📋 Clinical Summary</h2>
    <p style="font-size: 13px; line-height: 1.6; color: #334155;">${aiAnalysis.overallHealthSummary}</p>
  </div>` : ''}

  ${aiAnalysis?.riskFactors?.length ? `
  <div class="section">
    <h2>⚠️ Primary Identified Risk Indicators</h2>
    <ul>${aiAnalysis.riskFactors.map((r) => `<li>${r}</li>`).join('')}</ul>
  </div>` : ''}

  ${aiAnalysis?.preventiveHealthAdvice?.length ? `
  <div class="section">
    <h2>🛡️ Preventive Care Guidelines</h2>
    <ul>${aiAnalysis.preventiveHealthAdvice.map((a) => `<li>${a}</li>`).join('')}</ul>
  </div>` : ''}

  ${aiAnalysis?.medicalCheckupSuggestions?.length ? `
  <div class="section">
    <h2>🩺 Recommended Laboratory & Clinical Screenings</h2>
    <ul>${aiAnalysis.medicalCheckupSuggestions.map((c) => `<li>${c}</li>`).join('')}</ul>
  </div>` : ''}

  <div class="disclaimer">
    ⚠️ <strong>Medical Notice</strong>: GeneGuard AI generates educational wellness insights only. It is not a medical diagnosis. Consult a licensed physician for clinical interpretation and treatment decisions.
  </div>
</body>
</html>`;
}
export function generateComprehensiveHealthReportHTML(data) {
    const { user, assessment, trackingHistory = [], goals = [], reports = [], preventiveEvents = [], familyMembers = [] } = data;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const healthScore = assessment?.calculations?.healthScore || 80;
    const bmi = assessment?.calculations?.bmi || (user.profile?.height && user.profile?.weight ? (user.profile.weight / Math.pow(user.profile.height / 100, 2)).toFixed(1) : 'N/A');
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GeneGuard AI - Comprehensive Health Record</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; padding: 40px; max-width: 960px; margin: 0 auto; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { color: #0284c7; font-size: 24px; font-weight: 800; }
    .header .meta { text-align: right; font-size: 12px; color: #64748b; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #e0f2fe; color: #0369a1; }
    .score-strip { display: flex; gap: 16px; margin-bottom: 24px; }
    .score-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; }
    .score-card .val { font-size: 28px; font-weight: 800; color: #0284c7; }
    .score-card .lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; }
    .section { margin-bottom: 24px; page-break-inside: avoid; }
    .section h2 { font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
    .table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .table th, .table td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .table th { background: #f1f5f9; font-weight: 600; color: #475569; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-size: 12px; }
    ul { padding-left: 18px; font-size: 12px; color: #334155; }
    li { margin-bottom: 4px; }
    .disclaimer { margin-top: 30px; padding: 12px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; font-size: 11px; color: #92400e; text-align: center; }
    .signature-box { margin-top: 40px; display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🧬 GeneGuard AI — Patient Health Portfolio</h1>
      <p style="font-size: 13px; color: #475569;">Comprehensive Clinical Wellness & Preventive Analytics</p>
    </div>
    <div class="meta">
      <div><strong>Date:</strong> ${date}</div>
      <div><strong>Patient:</strong> ${user.name} (${user.email})</div>
      <div><strong>Status:</strong> Active Confidential Record</div>
    </div>
  </div>

  <div class="score-strip">
    <div class="score-card">
      <div class="val">${healthScore} / 100</div>
      <div class="lbl">GeneGuard Health Score</div>
    </div>
    <div class="score-card">
      <div class="val">${bmi}</div>
      <div class="lbl">Body Mass Index (BMI)</div>
    </div>
    <div class="score-card">
      <div class="val">${user.profile?.age || assessment?.personalInfo?.age || 'N/A'} yrs</div>
      <div class="lbl">Patient Age (${user.profile?.gender || 'unspecified'})</div>
    </div>
    <div class="score-card">
      <div class="val">${user.profile?.bloodGroup || assessment?.personalInfo?.bloodGroup || 'O+'}</div>
      <div class="lbl">Blood Group</div>
    </div>
  </div>

  <div class="section">
    <h2>1. Executive Clinical Summary</h2>
    <div class="card-box">
      <p style="line-height: 1.6;">
        ${assessment?.aiAnalysis?.overallHealthSummary || 'Patient maintains active engagement in preventive health tracking. Core biometrics are monitored within standard physiological reference thresholds.'}
      </p>
    </div>
  </div>

  <div class="section grid-2">
    <div>
      <h2>2. Active Health Goals (${goals.length})</h2>
      <table class="table">
        <thead>
          <tr><th>Goal</th><th>Progress</th><th>Target Date</th></tr>
        </thead>
        <tbody>
          ${goals.length ? goals.map((g) => `
            <tr>
              <td><strong>${g.title}</strong></td>
              <td>${g.current}/${g.target} ${g.unit}</td>
              <td>${new Date(g.targetDate).toLocaleDateString()}</td>
            </tr>
          `).join('') : '<tr><td colspan="3">No active health goals.</td></tr>'}
        </tbody>
      </table>
    </div>

    <div>
      <h2>3. Preventive Health Calendar Screenings</h2>
      <table class="table">
        <thead>
          <tr><th>Screening</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${preventiveEvents.length ? preventiveEvents.slice(0, 5).map((ev) => `
            <tr>
              <td><strong>${ev.title}</strong></td>
              <td>${ev.date}</td>
              <td><span class="badge">${ev.status}</span></td>
            </tr>
          `).join('') : '<tr><td colspan="3">No screenings scheduled.</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <h2>4. Familial Lineage & Hereditary Health Factors</h2>
    <div class="card-box">
      ${familyMembers.length ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px;">
          ${familyMembers.map((m) => `
            <div style="padding: 6px 10px; background: #fff; border-radius: 6px; border: 1px solid #e2e8f0;">
              <strong style="text-transform: capitalize;">${m.relation.replace(/_/g, ' ')}:</strong>
              <span style="color: #64748b;">${m.conditions?.join(', ') || 'No known conditions'}</span>
            </div>
          `).join('')}
        </div>
      ` : '<p style="color: #64748b;">No family hereditary records registered.</p>'}
    </div>
  </div>

  <div class="section">
    <h2>5. Diagnostic Medical Reports & Lab History (${reports.length})</h2>
    <table class="table">
      <thead>
        <tr><th>Report Name</th><th>Category</th><th>Upload Date</th><th>Key Findings</th></tr>
      </thead>
      <tbody>
        ${reports.length ? reports.map((r) => `
          <tr>
            <td><strong>${r.fileName}</strong></td>
            <td>${r.reportType || 'Medical Report'}</td>
            <td>${new Date(r.createdAt).toLocaleDateString()}</td>
            <td>${r.structuredAnalysis?.abnormalValues?.length ? r.structuredAnalysis.abnormalValues.slice(0, 2).join('; ') : 'Within standard baseline'}</td>
          </tr>
        `).join('') : '<tr><td colspan="4">No laboratory reports uploaded.</td></tr>'}
      </tbody>
    </table>
  </div>

  <div class="signature-box">
    <div><strong>Patient Signature:</strong> ___________________________</div>
    <div><strong>Reviewing Physician:</strong> ___________________________</div>
    <div><strong>Date:</strong> ______________</div>
  </div>

  <div class="disclaimer">
    ⚠️ <strong>Clinical Notice</strong>: This health summary report is generated for personal wellness and preventive tracking purposes. It does not constitute formal medical diagnosis or prescription. Always consult your healthcare provider.
  </div>
</body>
</html>`;
}
