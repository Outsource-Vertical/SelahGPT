import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbedding } from '../utils/embeddings';
import { PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX_NAME } from '@env';

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: PINECONE_ENVIRONMENT,
});

const index = pinecone.index(PINECONE_INDEX_NAME);

// 🔹 Store memory (text → vector → Pinecone)
export const storeMemory = async ({
  userId,
  module,
  text,
  metadata = {},
}: {
  userId: string;
  module: string;
  text: string;
  metadata?: Record<string, any>;
}) => {
  const embedding = await getEmbedding(text);
  const id = `${userId}-${module}-${Date.now()}`;

  await index.namespace(userId).upsert([
    {
      id,
      values: embedding,
      metadata: {
        ...metadata,
        module,
        text,
        createdAt: new Date().toISOString(),
      },
    },
  ]);
};

// 🔹 Retrieve related memories
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

  const results = await index.namespace(userId).query({
    vector: embedding,
    topK,
    filter: { module },
    includeMetadata: true,
  });

  return results.matches || [];
};
