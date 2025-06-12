import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FinanceProfile } from '../types/FinanceProfile';

export const saveFinanceProfile = async (
  userId: string,
  data: Partial<FinanceProfile>
) => {
  const ref = doc(db, 'users', userId, 'modules', 'finance');
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getFinanceProfile = async (
  userId: string
): Promise<FinanceProfile | null> => {
  const ref = doc(db, 'users', userId, 'modules', 'finance');
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FinanceProfile) : null;
};
