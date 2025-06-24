import { Request, Response } from "express";
import { getEmbedding } from "./utils/embeddings";
import { pineconeQuery, pineconeUpsert } from "./utils/pineconeClient";

export const storeMemoryHandler = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      module,
      text,
      role = "user",
      threadId,
      tags = [],
      tone,
    } = req.body;

    const embedding = await getEmbedding(text);
    const vectorId = `${userId}-${module}-${Date.now()}`;

    const existing = await pineconeQuery(userId, embedding, 3, { module });
    const isDuplicate = (existing as any)?.matches?.some(
      (match: any) => match.score > 0.95,
    );

    if (isDuplicate) {
      return res
        .status(200)
        .json({ success: false, message: "Duplicate memory" });
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

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ storeMemoryHandler error:", err);
    res.status(500).json({ success: false, message: "Failed to store memory" });
  }
};

export const retrieveMemoryHandler = async (req: Request, res: Response) => {
  try {
    const { userId, module, query, topK = 5 } = req.body;
    const embedding = await getEmbedding(query);
    const result = await pineconeQuery(userId, embedding, topK, { module });
    res.status(200).json({ matches: (result as any)?.matches || [] });
  } catch (err) {
    console.error("❌ retrieveMemoryHandler error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve memory" });
  }
};
