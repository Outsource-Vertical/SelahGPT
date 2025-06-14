import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { HealthProfile } from '@types/HealthProfile';

export const saveHealthProfile = async (
  userId: string,
  data: Partial<HealthProfile>
) => {
  const ref = doc(db, 'users', userId, 'modules', 'health');
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getHealthProfile = async (
  userId: string
): Promise<HealthProfile | null> => {
  const ref = doc(db, 'users', userId, 'modules', 'health');
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as HealthProfile) : null;
};
