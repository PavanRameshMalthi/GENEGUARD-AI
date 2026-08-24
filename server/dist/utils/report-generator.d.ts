export declare function generateHealthReportHTML(assessment: any): string;
export declare function generateComprehensiveHealthReportHTML(data: {
    user: any;
    assessment?: any;
    trackingHistory?: any[];
    goals?: any[];
    reports?: any[];
    preventiveEvents?: any[];
    familyMembers?: any[];
}): string;
