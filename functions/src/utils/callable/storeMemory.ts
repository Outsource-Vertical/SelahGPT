// functions/src/callable/storeMemory.ts
import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
import axios from "axios";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

const MEMORY_API_URL =
  "https://memory-api-826773862580.us-central1.run.app/store"; // Adjust path if needed

export const storeMemory = onCall(async (req) => {
  const { uid, message, module = "general" } = req.data;

  if (!uid || !message) {
    throw new HttpsError("invalid-argument", "Missing uid or message");
  }

  try {
    const response = await axios.post(MEMORY_API_URL, {
      uid,
      message,
      module,
    });

    logger.info("Memory stored via memory-api:", response.data);

    return { success: true, data: response.data };
  } catch (err: any) {
    logger.error(
      "Failed to call memory-api:",
      err.response?.data || err.message,
    );
    throw new HttpsError("internal", "Failed to store memory");
  }
});
