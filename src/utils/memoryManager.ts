import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

const callstoreMemory = httpsCallable(functions, "storeMemory");
const callRetrieveMemory = httpsCallable(functions, "retrieveMemory");

export const storeMemory = async ({
  userId,
  module,
  text,
  role = "user",
  threadId,
  tags = [],
  tone,
}: {
  userId: string;
  module: string;
  text: string;
  role?: string;
  threadId?: string;
  tags?: string[];
  tone?: string;
}) => {
  try {
    const res = await callstoreMemory({
      userId,
      module,
      text,
      role,
      threadId,
      tags,
      tone,
    });

    return res?.data ?? { success: false, message: "Unknown error" };
  } catch (err) {
    console.error("❌ storeMemory (client) failed:", err);
    return { success: false, message: "Exception thrown" };
  }
};

export const retrieveMemory = async ({
  userId,
  module,
  query,
  topK = 5,
}: {
  userId: string;
  module: string;
  query: string;
  topK?: number;
}) => {
  try {
    const res = await callRetrieveMemory({
      userId,
      module,
      query,
      topK,
    });

    return res?.data?.matches ?? [];
  } catch (err) {
    console.error("❌ retrieveMemory (client) failed:", err);
    return [];
  }
};
