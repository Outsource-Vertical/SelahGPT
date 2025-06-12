import axios from 'axios';
import { OPENAI_EMBEDDING_KEY } from '@env';

export const getEmbedding = async (text: string): Promise<number[]> => {
  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      input: text,
      model: 'text-embedding-3-small',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_EMBEDDING_KEY}`,
      },
    }
  );

  return response.data.data[0].embedding;
};
