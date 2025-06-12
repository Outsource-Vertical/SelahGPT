import { useState, useEffect } from 'react';
import { OPENAI_API_KEY } from '@env';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { Alert } from 'react-native';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TIER_LIMITS: Record<string, number> = {
  free: 10,
  pro: 50,
  'faith+': 100,
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [tier, setTier] = useState('free');

  useEffect(() => {
    const fetchUsage = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const docRef = doc(db, 'users', uid);

      try {
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          await setDoc(docRef, {
            usage: 0,
            tier: 'free',
            lastReset: serverTimestamp(),
          });
          setUsage(0);
          setTier('free');
          return;
        }

        const data = snapshot.data();
        const today = new Date().toISOString().split('T')[0];
        const lastReset = data?.lastReset?.toDate?.().toISOString().split('T')[0];

        if (lastReset !== today) {
          await updateDoc(docRef, {
            usage: 0,
            lastReset: serverTimestamp(),
          });
          setUsage(0);
          setBlocked(false);
        } else {
          const userTier = data?.tier || 'free';
          const currentUsage = data?.usage || 0;
          const limit = TIER_LIMITS[userTier] ?? 10;

          setTier(userTier);
          setUsage(currentUsage);
          setBlocked(currentUsage >= limit);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        Alert.alert('Error', 'Failed to access your chat profile. Check Firestore rules.');
      }
    };

    fetchUsage();
  }, []);

  const sendMessage = async (text: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (blocked) {
      Alert.alert(
        'Limit Reached',
        'You’ve hit your daily message limit. Upgrade your plan to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: newMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.choices?.[0]?.message?.content) {
        throw new Error('OpenAI response failed');
      }

      const aiReply = data.choices[0].message.content.trim();
      setMessages([...newMessages, { role: 'assistant', content: aiReply }]);

      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        usage: increment(1),
        lastUsed: serverTimestamp(),
      });

      const newUsage = usage + 1;
      setUsage(newUsage);

      const limit = TIER_LIMITS[tier] ?? 10;
      if (newUsage >= limit) setBlocked(true);
    } catch (error) {
      console.error('Error talking to GPT:', error);
      Alert.alert('Error', 'There was a problem talking to GPT or saving usage.');
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, usage, blocked };
}
