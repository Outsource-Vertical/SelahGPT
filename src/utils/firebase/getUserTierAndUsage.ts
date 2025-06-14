import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../src/services/firebase";

export async function getUserTierAndUsage() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("No user logged in");

  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) throw new Error("User document not found");

  const { tier = "free", usage = 0 } = userDoc.data();
  return { tier, usage };
}
