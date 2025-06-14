import { auth, db } from '@services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function setInitialProfile(uid: string) {
  const profileRef = doc(db, 'users', uid, 'profile', 'data');

  const defaultProfile = {
    goals: {
      lifeGoals: [],
      dailyFocus: ""
    },
    faith: {
      denomination: "",
      favoriteVerses: [],
      spiritualDisciplines: [],
    },
    finances: {
      tithePercentage: 10,
      netWorthGoal: 0,
      monthlyBudget: 0
    },
    family: {
      spouse: "",
      kids: [],
      priorities: ""
    },
    health: {
      weightGoal: "",
      sleepGoal: "",
      habits: []
    },
    preferences: {
      tone: "Friendly",
      bibleVersion: "NIV",
      topicsOfInterest: ["Wisdom", "Anxiety"]
    },
    lastUpdated: new Date().toISOString()
  };

  await setDoc(profileRef, defaultProfile);
}
