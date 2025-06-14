import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FamilyProfile } from '@types/FamilyProfile';

export const saveFamilyProfile = async (
  userId: string,
  data: Partial<FamilyProfile>
) => {
  const ref = doc(db, 'users', userId, 'modules', 'family');
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getFamilyProfile = async (
  userId: string
): Promise<FamilyProfile | null> => {
  const ref = doc(db, 'users', userId, 'modules', 'family');
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FamilyProfile) : null;
};
