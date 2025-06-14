import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { MonthlyBudget } from '@types/MonthlyBudget';

/**
 * Save or update the user's budget for a given month.
 */
export const saveMonthlyBudget = async (
  userId: string,
  monthId: string,
  data: Partial<MonthlyBudget>
) => {
  const ref = doc(db, 'users', userId, 'modules', 'finance', 'budget', monthId);
  await setDoc(
    ref,
    {
      ...data,
      month: monthId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Fetch the user's monthly budget by monthId (e.g. "2025-06")
 */
export const getMonthlyBudget = async (
  userId: string,
  monthId: string
): Promise<MonthlyBudget | null> => {
  const ref = doc(db, 'users', userId, 'modules', 'finance', 'budget', monthId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as MonthlyBudget) : null;
};
