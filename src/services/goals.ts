import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { GoalsProfile } from "@types/GoalsProfile";

export async function saveGoalsProfile(
  uid: string,
  updates: Partial<GoalsProfile>,
) {
  const ref = doc(db, "users", uid, "goals", "profile");
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, { ...updates });
  } else {
    await updateDoc(ref, updates);
  }
}
