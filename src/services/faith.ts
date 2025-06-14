import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { FaithProfile } from "@types/FaithProfile";

/**
 * Save or update the user's faith profile.
 * Automatically merges changes and timestamps them.
 */
export const saveFaithProfile = async (
  userId: string,
  data: Partial<FaithProfile>,
) => {
  const ref = doc(db, "users", userId, "modules", "faith");
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

/**
 * Fetch the user's faith profile from Firestore.
 * Returns null if the profile doesn't exist yet.
 */
export const getFaithProfile = async (
  userId: string,
): Promise<FaithProfile | null> => {
  const ref = doc(db, "users", userId, "modules", "faith");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FaithProfile) : null;
};
