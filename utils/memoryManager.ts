import { db } from '../firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getEmbedding } from './embeddings'; // You’ll wire this up later

export async function storeMemory({
  userId,
  module,
  text,
  metadata = {}
}: {
  userId: string;
  module: string;
  text: string;
  metadata?: Record<string, any>;
}) {
  const memoryRef = collection(db, 'users', userId, 'memories');
  const embedding = await getEmbedding(text); // Future step
  await addDoc(memoryRef, {
    module,
    text,
    embedding,
    metadata,
    createdAt: serverTimestamp(),
  });
}
