import { tagExtractor } from "@utils/tagExtractor";
import { auth } from "@services/firebase";
import { getIdToken } from "firebase/auth";
import uuid from "react-native-uuid";
const uuidv4 = () => uuid.v4().toString();

// ✅ Replace with your actual deployed Cloud Run URL
const MEMORY_API_URL = "https://your-cloud-run-service-url.a.run.app";

export const storeMemory = async ({
  userId,
  module,
  text,
  role = "user",
  threadId = uuidv4(),
  tags = [],
  tone,
}: {
  userId: string;
  module: string;
  text: string;
  role?: "user" | "assistant";
  threadId?: string;
  tags?: string[];
  tone?: string;
}) => {
  try {
    if (tags.length === 0 && role === "user") {
      tags = await tagExtractor(text);
    }

    const token = await getIdToken(auth.currentUser!); // 🔐 Auth token for secure APIs

    const res = await fetch(`${MEMORY_API_URL}/storeMemory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        module,
        text,
        role,
        threadId,
        tags,
        tone,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("Memory store failed:", data.message || res.statusText);
    }
  } catch (err) {
    console.error("❌ Memory store error:", err);
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
    const token = await getIdToken(auth.currentUser!);

    const res = await fetch(`${MEMORY_API_URL}/retrieveMemory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, module, query, topK }),
    });

    const data = await res.json();
    return data?.matches || [];
  } catch (err) {
    console.error("❌ Memory retrieve error:", err);
    return [];
  }
};
