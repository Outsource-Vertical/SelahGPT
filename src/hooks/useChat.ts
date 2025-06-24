import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { OPENAI_API_KEY } from "@env";
import { db, auth } from "@services/firebase";
import { storeMemory, retrieveMemory } from "../services/memory";
import { inferModule, parseProfileUpdate } from "../utils/chatParser";
import { ENV } from "@utils/env";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { saveFitnessProfile } from "../services/fitness";
import { saveFaithProfile } from "../services/faith";
import { saveFinanceProfile } from "../services/finance";
import { saveGoalsProfile } from "../services/goals";
import { saveHealthProfile } from "../services/health";

import uuid from "react-native-uuid";
const uuidv4 = () => uuid.v4().toString();

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TIER_LIMITS: Record<string, number> = {
  free: 10,
  pro: 50,
  "faith+": 100,
};

const saveProfileByModule = async (
  module: string,
  uid: string,
  updates: any,
) => {
  const map: Record<string, (uid: string, updates: any) => Promise<void>> = {
    fitness: saveFitnessProfile,
    faith: saveFaithProfile,
    finance: saveFinanceProfile,
    goals: saveGoalsProfile,
    health: saveHealthProfile,
  };

  const saveFn = map[module];
  if (!saveFn) throw new Error(`Unsupported module: ${module}`);
  await saveFn(uid, updates);
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [tier, setTier] = useState("free");
  const [threadId] = useState(() => uuid.v4().toString());

  useEffect(() => {
    const fetchUsage = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const docRef = doc(db, "users", uid);

      try {
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          await setDoc(docRef, {
            usage: 0,
            tier: "free",
            lastReset: serverTimestamp(),
          });
          setUsage(0);
          setTier("free");
          return;
        }

        const data = snapshot.data();
        const today = new Date().toISOString().split("T")[0];
        const lastReset = data?.lastReset
          ?.toDate?.()
          .toISOString()
          .split("T")[0];

        if (lastReset !== today) {
          await updateDoc(docRef, {
            usage: 0,
            lastReset: serverTimestamp(),
          });
          setUsage(0);
          setBlocked(false);
        } else {
          const userTier = data?.tier || "free";
          const currentUsage = data?.usage || 0;
          const limit = TIER_LIMITS[userTier] ?? 10;

          setTier(userTier);
          setUsage(currentUsage);
          setBlocked(currentUsage >= limit);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        Alert.alert("Error", "Failed to access your chat profile.");
      }
    };

    fetchUsage();
  }, []);

  const sendMessage = async (text: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (blocked) {
      Alert.alert(
        "Limit Reached",
        "You’ve hit your daily message limit. Upgrade your plan to continue.",
        [{ text: "OK" }],
      );
      return;
    }

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const module = inferModule(text);

      // 🔄 Save user message to memory
      await storeMemory({
        userId: uid,
        module,
        text,
        role: "user",
        threadId,
      });

      // 🧠 Profile Update Attempt
      const profileUpdate = parseProfileUpdate(text);
      if (profileUpdate) {
        const { module, field, value } = profileUpdate;
        await saveProfileByModule(module, uid, { [field]: value });

        const reply = `Got it — I’ve updated your ${field.replace(/([A-Z])/g, " $1").toLowerCase()} to ${value}.`;

        setMessages([...newMessages, { role: "assistant", content: reply }]);

        await storeMemory({
          userId: uid,
          module,
          text: reply,
          role: "assistant",
          threadId,
          tone: "informative",
        });

        await updateDoc(doc(db, "users", uid), {
          usage: increment(1),
          lastUsed: serverTimestamp(),
        });

        const newUsage = usage + 1;
        setUsage(newUsage);
        if (newUsage >= (TIER_LIMITS[tier] ?? 10)) setBlocked(true);

        setLoading(false);
        return;
      }

      // 🔍 Recall prior relevant memory
      const memoryResults = await retrieveMemory({
        userId: uid,
        module,
        query: text,
        topK: 5,
      });

      const memorySummary = memoryResults
        .map((m) => `- ${m.metadata?.text}`)
        .join("\n");

      const openaiMessages = [
        {
          role: "system",
          content: memoryResults.length
            ? `Here are past relevant memories:\n${memorySummary}`
            : `No prior memory available.`,
        },
        ...newMessages,
      ];

      // 💬 Send to GPT
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: openaiMessages,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.choices?.[0]?.message?.content) {
        throw new Error("OpenAI response failed");
      }

      const aiReply = data.choices[0].message.content.trim();
      const updatedMessages = [
        ...newMessages,
        { role: "assistant", content: aiReply },
      ];
      setMessages(updatedMessages);

      // 💾 Store assistant reply
      await storeMemory({
        userId: uid,
        module,
        text: aiReply,
        role: "assistant",
        threadId,
        tone: "gentle",
      });

      await updateDoc(doc(db, "users", uid), {
        usage: increment(1),
        lastUsed: serverTimestamp(),
      });

      const newUsage = usage + 1;
      setUsage(newUsage);
      if (newUsage >= (TIER_LIMITS[tier] ?? 10)) setBlocked(true);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert(
        "Error",
        "Something went wrong while processing your message.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, usage, blocked };
}
