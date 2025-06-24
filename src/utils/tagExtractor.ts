import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

const callExtractTags = httpsCallable(functions, "extractTags");

export const tagExtractor = async (text: string): Promise<string[]> => {
  try {
    const res = await callExtractTags({ text });
    return res?.data?.tags ?? [];
  } catch (err) {
    console.error("❌ Tag extraction failed:", err);
    return [];
  }
};
