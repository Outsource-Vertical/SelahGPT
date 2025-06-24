// functions/src/utils/env.ts

import * as dotenv from "dotenv";

// ✅ Always load .env file in any non-production environment
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const ENV = {
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_EMBEDDING_KEY: process.env.OPENAI_EMBEDDING_KEY || "",

  // Pinecone
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || "",
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT || "",
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME || "",
  PINECONE_PROJECT_ID: process.env.PINECONE_PROJECT_ID || "",

  // Firebase (client-side config used by some APIs)
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "",
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "",
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "",
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "",
};

// ✅ Helpful console log in development
if (process.env.NODE_ENV !== "production") {
  console.log("✅ ENV loaded:", {
    OPENAI_EMBEDDING_KEY: ENV.OPENAI_EMBEDDING_KEY ? "✅" : "❌",
    PINECONE_API_KEY: ENV.PINECONE_API_KEY ? "✅" : "❌",
    FIREBASE_PROJECT_ID: ENV.FIREBASE_PROJECT_ID || "❌",
  });
}
