import { ENV } from "./env";

if (
  !ENV.PINECONE_API_KEY ||
  !ENV.PINECONE_PROJECT_ID ||
  !ENV.PINECONE_INDEX_NAME ||
  !ENV.PINECONE_ENVIRONMENT
) {
  console.error("❌ Missing Pinecone environment variables");
}

const BASE_URL = `https://${ENV.PINECONE_INDEX_NAME}-${ENV.PINECONE_PROJECT_ID}.svc.${ENV.PINECONE_ENVIRONMENT}.pinecone.io`;

const headers = {
  "Content-Type": "application/json",
  "Api-Key": ENV.PINECONE_API_KEY,
};

export const pineconeUpsert = async (namespace: string, vectors: any[]) => {
  try {
    const res = await fetch(`${BASE_URL}/vectors/upsert`, {
      method: "POST",
      headers,
      body: JSON.stringify({ namespace, vectors }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("🔴 Pinecone Upsert Error:", data);
      throw new Error((data as any).message || "Failed to upsert vector");
    }

    console.log(
      "🔼 Upserting to Pinecone:",
      JSON.stringify({ namespace, vectors }, null, 2),
    );

    return data;
  } catch (err: any) {
    console.error(
      "🔴 Network error during Pinecone upsert:",
      err?.response?.data || err.message || err,
    );
    throw err;
  }
};

export const pineconeQuery = async (
  namespace: string,
  vector: number[],
  topK = 5,
  filter?: object,
) => {
  try {
    const res = await fetch(`${BASE_URL}/query`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        namespace,
        topK,
        vector,
        includeMetadata: true,
        ...(filter && { filter }),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("🔴 Pinecone Query Error:", data);
      throw new Error((data as any).message || "Pinecone query failed");
    }

    return data;
  } catch (err: any) {
    console.error(
      "🔴 Network error during Pinecone query:",
      err?.response?.data || err.message || err,
    );
    throw err;
  }
};
