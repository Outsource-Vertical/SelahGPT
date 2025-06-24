import { getEmbedding } from "@utils/embeddings";
import { tagExtractor } from "@utils/tagExtractor";
import { pineconeUpsert, pineconeQuery } from "@utils/pineconeClient";
import uuid from "react-native-uuid";
const uuidv4 = () => uuid.v4().toString();

// 🔹 Store memory with dedup, tagging, metadata
export const storeMemory = async ({
  userId,
  module,
  text,
  role = "user",
  threadId = uuid.v4().toString(),
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
    const embedding = await getEmbedding(text);
    const vectorId = `${userId}-${module}-${Date.now()}`;

    // 🔁 Semantic deduplication
    const existing = await pineconeQuery(userId, embedding, 3, { module });
    const isDuplicate = existing?.matches?.some(
      (match: any) => match.score > 0.95,
    );

    if (isDuplicate) {
      console.log("🔁 Duplicate skipped:", text);
      return;
    }

    // 🏷️ Tag extraction
    if (tags.length === 0 && role === "user") {
      tags = await tagExtractor(text);
    }

    // 💾 Store vector
    await pineconeUpsert(userId, [
      {
        id: vectorId,
        values: embedding,
        metadata: {
          userId,
          text,
          module,
          role,
          threadId,
          createdAt: new Date().toISOString(),
          ...(tags.length > 0 && { tags }),
          ...(tone && { tone }),
        },
      },
    ]);
  } catch (err) {
    console.error("❌ Memory store failed:", err);
  }
};

// 🔍 Retrieve similar memories
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
  const embedding = await getEmbedding(query);
  const result = await pineconeQuery(userId, embedding, topK, { module });
  return result?.matches || [];
};

// 🧪 Get all memories for debugging
export const getAllMemoriesForUser = async (userId: string): Promise<any[]> => {
  const dummy = Array(1536).fill(0); // no vector input = closest to "everything"
  const result = await pineconeQuery(userId, dummy, 100);
  return result?.matches || [];
};
