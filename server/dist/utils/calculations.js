export function calculateBMI(height, weight) {
    if (!height || !weight || height <= 0 || weight <= 0)
        return 0;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return isNaN(bmi) ? 0 : Number(bmi.toFixed(1));
}
export function getBMICategory(bmi) {
    if (!bmi || bmi <= 0)
        return 'Unknown';
    if (bmi < 18.5)
        return 'Underweight';
    if (bmi < 25)
        return 'Normal weight';
    if (bmi < 30)
        return 'Overweight';
    return 'Obese';
}
export function getIdealWeightRange(height) {
    if (!height || height <= 0)
        return { min: 0, max: 0 };
    const heightM = height / 100;
    return {
        min: Number((18.5 * heightM * heightM).toFixed(1)),
        max: Number((24.9 * heightM * heightM).toFixed(1))
    };
}
export function calculateDailyWaterRequirement(weight, activityLevel) {
    if (!weight || weight <= 0)
        return 2.0;
    let base = weight * 0.033;
    if (activityLevel === 'Very Active' || activityLevel === 'Highly Active')
        base += 0.5;
    if (activityLevel === 'Moderately Active')
        base += 0.3;
    return Number(base.toFixed(1));
}
export function getRecommendedSleep(age) {
    if (!age || age <= 0)
        return 8;
    if (age <= 5)
        return 11;
    if (age <= 13)
        return 10;
    if (age <= 17)
        return 9;
    if (age <= 25)
        return 8;
    if (age <= 64)
        return 7.5;
    return 7;
}
export function calculateCalories(age, gender, height, weight, activityLevel) {
    if (!age || !height || !weight || height <= 0 || weight <= 0 || age <= 0)
        return 2000;
    // Harris-Benedict equation
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    const activityMultipliers = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Highly Active': 1.9
    };
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    const result = Math.round(bmr * multiplier);
    return isNaN(result) || result < 500 ? 2000 : result;
}
export function getActivityLevel(stepsPerDay = 0, exerciseFrequency = 'never', workingHours = 8) {
    let score = 0;
    const steps = Number(stepsPerDay) || 0;
    if (steps >= 12000)
        score += 4;
    else if (steps >= 8000)
        score += 3;
    else if (steps >= 5000)
        score += 2;
    else if (steps >= 3000)
        score += 1;
    const freqScores = {
        'daily': 4,
        '5-6 times/week': 3,
        '3-4 times/week': 2,
        '1-2 times/week': 1,
        'never': 0
    };
    score += freqScores[exerciseFrequency] || 0;
    // Sedentary work penalty
    if (Number(workingHours) >= 10)
        score -= 1;
    if (score >= 7)
        return 'Highly Active';
    if (score >= 5)
        return 'Very Active';
    if (score >= 3)
        return 'Moderately Active';
    if (score >= 1)
        return 'Lightly Active';
    return 'Sedentary';
}
export function calculateHealthScore(input) {
    let score = 100;
    // BMI (max -20)
    const bmi = calculateBMI(input.height, input.weight);
    if (bmi > 0) {
        if (bmi < 18.5 || bmi >= 30)
            score -= 20;
        else if (bmi >= 25)
            score -= 10;
        else if (bmi < 20)
            score -= 5;
    }
    // Sleep (max -15)
    const recommended = getRecommendedSleep(input.age);
    const sleepHours = Number(input.sleepHours) || 0;
    const sleepDiff = Math.abs(sleepHours - recommended);
    if (sleepDiff >= 3)
        score -= 15;
    else if (sleepDiff >= 2)
        score -= 10;
    else if (sleepDiff >= 1)
        score -= 5;
    // Hydration (max -10)
    const waterReq = (Number(input.weight) || 70) * 0.033;
    const waterIntake = Number(input.dailyWaterIntake) || 0;
    if (waterIntake < waterReq * 0.5)
        score -= 10;
    else if (waterIntake < waterReq * 0.75)
        score -= 5;
    // Stress (max -15)
    const stress = Number(input.stressLevel) || 5;
    if (stress >= 8)
        score -= 15;
    else if (stress >= 6)
        score -= 10;
    else if (stress >= 4)
        score -= 5;
    // Smoking (max -15)
    if (input.smoking === 'yes')
        score -= 15;
    // Alcohol (max -10)
    if (input.alcohol === 'frequently')
        score -= 10;
    else if (input.alcohol === 'occasionally')
        score -= 3;
    // Exercise (max -10)
    if (input.exerciseFrequency === 'never')
        score -= 10;
    else if (input.exerciseFrequency === '1-2 times/week')
        score -= 5;
    // Nutrition (max -10)
    if (input.fastFoodFrequency === 'daily')
        score -= 7;
    else if (input.fastFoodFrequency === '2-3 times/week')
        score -= 4;
    if (input.sugarIntake === 'high')
        score -= 3;
    if ((Number(input.fruitsPerWeek) || 0) < 3)
        score -= 2;
    if ((Number(input.vegetablesPerWeek) || 0) < 3)
        score -= 2;
    // Medical conditions (max -10)
    const medConds = Array.isArray(input.medicalConditions) ? input.medicalConditions : [];
    score -= Math.min(medConds.length * 3, 10);
    // Symptoms (max -5)
    const symps = Array.isArray(input.symptoms) ? input.symptoms : [];
    score -= Math.min(symps.length * 1, 5);
    return Math.max(0, Math.min(100, score));
}
export function getRiskLevel(healthScore, medicalConditions = [], familyConditions = []) {
    let risk = 0;
    if (healthScore < 40)
        risk += 3;
    else if (healthScore < 60)
        risk += 2;
    else if (healthScore < 75)
        risk += 1;
    const medConds = Array.isArray(medicalConditions) ? medicalConditions : [];
    const famConds = Array.isArray(familyConditions) ? familyConditions : [];
    risk += Math.min(medConds.length, 3);
    risk += Math.min(Math.floor(famConds.length / 2), 2);
    if (risk >= 6)
        return 'Very High';
    if (risk >= 4)
        return 'High';
    if (risk >= 2)
        return 'Moderate';
    return 'Low';
}
export function computeAllCalculations(input) {
    const bmi = calculateBMI(input.height, input.weight);
    const bmiCategory = getBMICategory(bmi);
    const idealWeight = getIdealWeightRange(input.height);
    const activityLevel = getActivityLevel(input.stepsPerDay, input.exerciseFrequency, input.workingHours);
    const dailyWaterRequirement = calculateDailyWaterRequirement(input.weight, activityLevel);
    const recommendedSleep = getRecommendedSleep(input.age);
    const caloriesNeeded = calculateCalories(input.age, input.gender, input.height, input.weight, activityLevel);
    const healthScore = calculateHealthScore(input);
    const riskLevel = getRiskLevel(healthScore, input.medicalConditions, input.familyConditions);
    return {
        bmi,
        bmiCategory,
        idealWeightMin: idealWeight.min,
        idealWeightMax: idealWeight.max,
        dailyWaterRequirement,
        recommendedSleep,
        caloriesNeeded,
        activityLevel,
        healthScore,
        riskLevel
    };
}
