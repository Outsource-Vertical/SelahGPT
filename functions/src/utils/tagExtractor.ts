import { ENV } from "./env";

export const tagExtractor = async (text: string): Promise<string[]> => {
  try {
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
              "You're a spiritual assistant. Return a JSON array of tags that summarize this message's emotional or spiritual content. Possible tags include: goal, struggle, praise, prayer, fear, doubt, discipline, gratitude, temptation, guidance, purpose, repentance, rest, breakthrough, progress. Only return relevant ones.",
          },
          { role: "user", content: text },
        ],
        temperature: 0.2,
      }),
    });

    const data = await res.json();
    const reply = (data as any)?.choices?.[0]?.message?.content ?? "";

    const match = reply.match(/\[.*?\]/s); // extract JSON array from GPT output
    return match ? JSON.parse(match[0]) : [];
  } catch (err) {
    console.error("❌ Failed to extract tags:", err);
    return [];
  }
};
