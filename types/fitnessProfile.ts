export interface FitnessProfile {
    currentWeight: number;
    targetWeight: number;
    height: string;
    bodyFatPercentage?: number;
    goalType: "weight loss" | "muscle gain" | "toning" | "endurance" | "event training";
    goalDeadline?: string;
    motivationReason?: string;
    fitnessLevel: "beginner" | "intermediate" | "advanced";
    preferredWorkoutTypes: string[];
    workoutFrequencyPerWeek: number;
    preferredWorkoutTime: "morning" | "afternoon" | "evening";
    equipmentAvailable: string[];
    injuries?: string[];
    dietStyle: "keto" | "low carb" | "intermittent fasting" | "balanced" | "other";
    allergies?: string[];
    habits: string[];
    remindersEnabled: boolean;
    wantsSpiritualEncouragement: boolean;
    favoriteScriptures: string[];
    updatedAt: any;
  }
  