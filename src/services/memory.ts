import { tagExtractor } from "@utils/tagExtractor";
import uuid from "react-native-uuid";
const uuidv4 = () => uuid.v4().toString();

const MEMORY_API_URL = "https://<YOUR_CLOUD_RUN_URL>"; // ← Replace with actual deployed Cloud Run URL

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

    const res = await fetch(`${MEMORY_API_URL}/storeMemory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${MEMORY_API_URL}/retrieveMemory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, module, query, topK }),
    });

    const data = await res.json();
    return data?.matches || [];
  } catch (err) {
    console.error("❌ Memory retrieve error:", err);
    return [];
  }
};
