export const profileFieldMap = {
  faith: {
    spiritualBackground: "string",
    theologicalStyle: "string",
    prayerSchedule: "string",
    spiritualGoals: "string[]",
    favoriteScriptures: "string[]",
    accountabilityPartner: "string",
    devotionPreference: "string",
    currentStruggles: "string[]",
    wantsScriptureEncouragement: "boolean",
  },
  family: {
    householdRole: "string",
    maritalStatus: "string",
    numberOfChildren: "number",
    childrenAges: "string",
    majorFamilyDates: "string[]",
    currentFamilyFocus: "string",
    familyChallenges: "string[]",
    gratitudeNotes: "string[]",
    wantsFamilyEncouragement: "boolean",
  },
  finance: {
    incomeType: "string",
    budgetStyle: "string",
    usesBudgetApp: "boolean",
    givingStyle: "string",
    moneyMindset: "string",
    spiritualViewOnMoney: "string",
    wantsScriptureFinancialAdvice: "boolean",
    financialGoals: "string[]",
    financialStressors: "string[]",
  },
  fitness: {
    currentWeight: "number",
    targetWeight: "number",
    height: "string",
  },
  health: {
    healthConditions: "string[]",
    dietaryRestrictions: "string[]",
    allergies: "string[]",
    sleepQuality: "string",
    exerciseRoutine: "string",
    medicationSchedule: "string",
    recentSymptoms: "string[]",
    mentalHealthFocus: "string",
    wantsHealthEncouragement: "boolean",
  },
  // optional: budget module (future)
  budget: {
    // placeholder for structured monthly budgeting
    // e.g., housing: number, transportation: number, etc.
  },
};
