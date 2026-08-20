import mongoose from 'mongoose';
export declare const Assessment: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    personalInfo?: {
        name?: string | null | undefined;
        age?: number | null | undefined;
        gender?: string | null | undefined;
        height?: number | null | undefined;
        weight?: number | null | undefined;
        bloodGroup?: string | null | undefined;
    } | null | undefined;
    lifestyle?: {
        smoking?: string | null | undefined;
        alcohol?: string | null | undefined;
        exercise?: string | null | undefined;
        sleep?: number | null | undefined;
        waterIntake?: number | null | undefined;
        stress?: string | null | undefined;
    } | null | undefined;
    medical?: {
        medicalHistory: string[];
        familyHistory: string[];
        symptoms: string[];
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        lifestyleImprovements: string[];
        dietSuggestions: string[];
        exerciseSuggestions: string[];
        mentalWellnessTips: string[];
        preventiveCheckups: string[];
        healthScore?: number | null | undefined;
        healthSummary?: string | null | undefined;
        hydrationAdvice?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    personalInfo?: {
        name?: string | null | undefined;
        age?: number | null | undefined;
        gender?: string | null | undefined;
        height?: number | null | undefined;
        weight?: number | null | undefined;
        bloodGroup?: string | null | undefined;
    } | null | undefined;
    lifestyle?: {
        smoking?: string | null | undefined;
        alcohol?: string | null | undefined;
        exercise?: string | null | undefined;
        sleep?: number | null | undefined;
        waterIntake?: number | null | undefined;
        stress?: string | null | undefined;
    } | null | undefined;
    medical?: {
        medicalHistory: string[];
        familyHistory: string[];
        symptoms: string[];
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        lifestyleImprovements: string[];
        dietSuggestions: string[];
        exerciseSuggestions: string[];
        mentalWellnessTips: string[];
        preventiveCheckups: string[];
        healthScore?: number | null | undefined;
        healthSummary?: string | null | undefined;
        hydrationAdvice?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: mongoose.Types.ObjectId;
    personalInfo?: {
        name?: string | null | undefined;
        age?: number | null | undefined;
        gender?: string | null | undefined;
        height?: number | null | undefined;
        weight?: number | null | undefined;
        bloodGroup?: string | null | undefined;
    } | null | undefined;
    lifestyle?: {
        smoking?: string | null | undefined;
        alcohol?: string | null | undefined;
        exercise?: string | null | undefined;
        sleep?: number | null | undefined;
        waterIntake?: number | null | undefined;
        stress?: string | null | undefined;
    } | null | undefined;
    medical?: {
        medicalHistory: string[];
        familyHistory: string[];
        symptoms: string[];
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        lifestyleImprovements: string[];
        dietSuggestions: string[];
        exerciseSuggestions: string[];
        mentalWellnessTips: string[];
        preventiveCheckups: string[];
        healthScore?: number | null | undefined;
        healthSummary?: string | null | undefined;
        hydrationAdvice?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    personalInfo?: {
        name?: string | null | undefined;
        age?: number | null | undefined;
        gender?: string | null | undefined;
        height?: number | null | undefined;
        weight?: number | null | undefined;
        bloodGroup?: string | null | undefined;
    } | null | undefined;
    lifestyle?: {
        smoking?: string | null | undefined;
        alcohol?: string | null | undefined;
        exercise?: string | null | undefined;
        sleep?: number | null | undefined;
        waterIntake?: number | null | undefined;
        stress?: string | null | undefined;
    } | null | undefined;
    medical?: {
        medicalHistory: string[];
        familyHistory: string[];
        symptoms: string[];
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        lifestyleImprovements: string[];
        dietSuggestions: string[];
        exerciseSuggestions: string[];
        mentalWellnessTips: string[];
        preventiveCheckups: string[];
        healthScore?: number | null | undefined;
        healthSummary?: string | null | undefined;
        hydrationAdvice?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    personalInfo?: {
        name?: string | null | undefined;
        age?: number | null | undefined;
        gender?: string | null | undefined;
        height?: number | null | undefined;
        weight?: number | null | undefined;
        bloodGroup?: string | null | undefined;
    } | null | undefined;
    lifestyle?: {
        smoking?: string | null | undefined;
        alcohol?: string | null | undefined;
        exercise?: string | null | undefined;
        sleep?: number | null | undefined;
        waterIntake?: number | null | undefined;
        stress?: string | null | undefined;
    } | null | undefined;
    medical?: {
        medicalHistory: string[];
        familyHistory: string[];
        symptoms: string[];
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        lifestyleImprovements: string[];
        dietSuggestions: string[];
        exerciseSuggestions: string[];
        mentalWellnessTips: string[];
        preventiveCheckups: string[];
        healthScore?: number | null | undefined;
        healthSummary?: string | null | undefined;
        hydrationAdvice?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    personalInfo?: {
        name?: string | null | undefined;
        age?: number | null | undefined;
        gender?: string | null | undefined;
        height?: number | null | undefined;
        weight?: number | null | undefined;
        bloodGroup?: string | null | undefined;
    } | null | undefined;
    lifestyle?: {
        smoking?: string | null | undefined;
        alcohol?: string | null | undefined;
        exercise?: string | null | undefined;
        sleep?: number | null | undefined;
        waterIntake?: number | null | undefined;
        stress?: string | null | undefined;
    } | null | undefined;
    medical?: {
        medicalHistory: string[];
        familyHistory: string[];
        symptoms: string[];
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        lifestyleImprovements: string[];
        dietSuggestions: string[];
        exerciseSuggestions: string[];
        mentalWellnessTips: string[];
        preventiveCheckups: string[];
        healthScore?: number | null | undefined;
        healthSummary?: string | null | undefined;
        hydrationAdvice?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
