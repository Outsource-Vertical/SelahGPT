import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { FitnessProfile } from "@types/FitnessProfile";

// Save function (already present)
export async function saveFitnessProfile(userId: string, data: Partial<FitnessProfile>) {
  const fitnessRef = doc(db, "users", userId, "modules", "fitness");
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await setDoc(fitnessRef, payload, { merge: true }); // merge keeps existing fields
}

// 🆕 Add this function:
export async function getFitnessProfile(userId: string): Promise<FitnessProfile | null> {
  try {
    const fitnessRef = doc(db, "users", userId, "modules", "fitness");
    const docSnap = await getDoc(fitnessRef);

    if (docSnap.exists()) {
      return docSnap.data() as FitnessProfile;
    } else {
      console.log("No fitness profile found for UID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching fitness profile:", error);
    return null;
  }
}
