import axios from "axios";
import { db } from "./firebase"; // your firebase-admin initialized Firestore instance
import { ENV } from "./env";

export const getEmbedding = async (text: string): Promise<number[]> => {
  if (!text) throw new Error("Missing text input for embedding");

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: text,
        model: "text-embedding-3-small",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ENV.OPENAI_EMBEDDING_KEY}`,
        },
      },
    );

    return res.data.data[0].embedding;
  } catch (err: any) {
    console.error(
      "❌ OpenAI embedding error:",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const embedAndstoreMemory = async ({
  uid,
  message,
  module = "general",
}: {
  uid: string;
  message: string;
  module?: string;
}): Promise<void> => {
  try {
    const vector = await getEmbedding(message);

    await db.collection("users").doc(uid).collection("memories").add({
      vector,
      text: message,
      module,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Failed to embed or store memory:", err);
  }
};
