import { tagExtractor } from "./utils/tagExtractor";
import { logger } from "firebase-functions";

export const extractTagsFromText = async (text: string): Promise<string[]> => {
  try {
    return await tagExtractor(text);
  } catch (err) {
    logger.error("Tag extraction failed:", err);
    throw new Error("Failed to extract tags");
  }
};
