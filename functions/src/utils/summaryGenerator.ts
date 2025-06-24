import { getEmbedding } from "./embeddings";
import { storeUserMemory, retrieveUserMemory } from "../memoryManager"; // adjust if needed
import { ENV } from "./env";

export const summaryGenerator = async ({
  userId,
  module,
  count = 25,
}: {
  userId: string;
  module?: string;
  count?: number;
}): Promise<string> => {
  try {
    // Step 1: Retrieve the latest memories from Pinecone
    const results = await retrieveUserMemory({
      userId,
      module: module || "general",
      query: "", // Dummy query for now
      topK: count,
    });

    const memoryTexts = results
      .map((m: any) => `• ${m.metadata?.text || ""}`)
      .join("\n");

    if (!memoryTexts) return "No summary available yet.";

    // Step 2: Send to OpenAI for summarization
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You're a spiritual life coach. Based on the following journal-style memories from a user, create a gentle, wise 3–5 sentence summary. Highlight their struggles, goals, spiritual growth, and emotional tone. Be warm, insightful, and encouraging.",
          },
          {
            role: "user",
            content: memoryTexts,
          },
        ],
        temperature: 0.6,
      }),
    });

    const data = await res.json();
    const summary = (data as any)?.choices?.[0]?.message?.content;

    return summary?.trim() || "No summary available.";
  } catch (err) {
    console.error("❌ Failed to generate summary:", err);
    return "Something went wrong while summarizing.";
  }
};
