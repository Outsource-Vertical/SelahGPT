import { getEmbedding } from "./utils/embeddings";
import { pineconeQuery, pineconeUpsert } from "./utils/pineconeClient";

interface storeMemoryParams {
  userId: string;
  module: string;
  text: string;
  role?: string;
  threadId?: string;
  tags?: string[];
  tone?: string;
}

interface RetrieveMemoryParams {
  userId: string;
  module: string;
  query: string;
  topK?: number;
}

interface StoreResult {
  success: boolean;
  message?: string;
}

export async function storeUserMemory({
  userId,
  module,
  text,
  role = "user",
  threadId,
  tags = [],
  tone,
}: storeMemoryParams): Promise<StoreResult> {
  try {
    const embedding = await getEmbedding(text);
    const vectorId = `${userId}-${module}-${Date.now()}`;

    const existing = await pineconeQuery(userId, embedding, 3, { module });
    const isDuplicate = (existing as any)?.matches?.some(
      (match: any) => match.score > 0.95,
    );
    if (isDuplicate) {
      return { success: false, message: "Duplicate memory" };
    }

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

    return { success: true };
  } catch (error: any) {
    console.error("🔴 Network error during Pinecone upsert:", error.message);
    throw new Error(error.message);
  }
}

export async function retrieveUserMemory({
  userId,
  module,
  query,
  topK = 5,
}: RetrieveMemoryParams): Promise<any[]> {
  try {
    const embedding = await getEmbedding(query);
    const result = await pineconeQuery(userId, embedding, topK, { module });
    return (result as any)?.matches || [];
  } catch (error: any) {
    console.error("🔴 Network error during Pinecone query:", error.message);
    throw new Error(error.message);
  }
}
