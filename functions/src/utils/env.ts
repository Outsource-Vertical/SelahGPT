// functions/src/utils/env.ts
import * as functions from "firebase-functions";

// Make sure dotenv only runs locally
if (process.env.NODE_ENV !== "production") {
  // Load .env only once for local dev
  require("dotenv").config();
}

export const ENV = {
  OPENAI_API_KEY:
    functions.config()?.openai?.key || process.env.OPENAI_API_KEY || "",
  OPENAI_EMBEDDING_KEY:
    functions.config()?.openai?.embedding_key ||
    process.env.OPENAI_EMBEDDING_KEY ||
    "",

  PINECONE_API_KEY:
    functions.config()?.pinecone?.api_key || process.env.PINECONE_API_KEY || "",
  PINECONE_ENVIRONMENT:
    functions.config()?.pinecone?.environment ||
    process.env.PINECONE_ENVIRONMENT ||
    "",
  PINECONE_INDEX_NAME:
    functions.config()?.pinecone?.index_name ||
    process.env.PINECONE_INDEX_NAME ||
    "",
  PINECONE_PROJECT_ID:
    functions.config()?.pinecone?.project_id ||
    process.env.PINECONE_PROJECT_ID ||
    "",

  FIREBASE_API_KEY:
    functions.config()?.firebase?.api_key || process.env.FIREBASE_API_KEY || "",
  FIREBASE_AUTH_DOMAIN:
    functions.config()?.firebase?.auth_domain ||
    process.env.FIREBASE_AUTH_DOMAIN ||
    "",
  FIREBASE_PROJECT_ID:
    functions.config()?.firebase?.project_id ||
    process.env.FIREBASE_PROJECT_ID ||
    "",
  FIREBASE_STORAGE_BUCKET:
    functions.config()?.firebase?.storage_bucket ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    "",
  FIREBASE_MESSAGING_SENDER_ID:
    functions.config()?.firebase?.messaging_sender_id ||
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    "",
  FIREBASE_APP_ID:
    functions.config()?.firebase?.app_id || process.env.FIREBASE_APP_ID || "",
};

// Debug log to verify environment values in dev
if (process.env.NODE_ENV !== "production") {
  console.log("✅ ENV loaded:", {
    PINECONE_API_KEY: ENV.PINECONE_API_KEY ? "✅" : "❌",
    OPENAI_API_KEY: ENV.OPENAI_API_KEY ? "✅" : "❌",
  });
}
