export interface FaithProfile {
  spiritualBackground?: string; // Their story or upbringing
  theologicalStyle?: string; // Their interpretive lens (optional)
  spiritualGoals: string[]; // ["Daily prayer", "Read Bible in a year"]
  prayerSchedule: string; // "Morning and Evening"
  favoriteScriptures: string[];
  accountabilityPartner?: string;
  devotionPreference: "verse of the day" | "guided prayer" | "journal prompts";
  wantsScriptureEncouragement: boolean;
  currentStruggles?: string[];
  updatedAt: any;
}
