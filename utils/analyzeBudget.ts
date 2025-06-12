import { MonthlyBudget } from '../types/MonthlyBudget';
import { getEmbedding } from './embeddings'; // already built
import { OPENAI_API_KEY } from '@env';

export const getBudgetFeedback = async (
  budget: MonthlyBudget,
  month: string
): Promise<string> => {
  const summary: string[] = [];

  for (const [category, subs] of Object.entries(budget)) {
    if (['month', 'updatedAt'].includes(category)) continue;

    const total = Object.values(subs).reduce((sum: number, val: any) => sum + parseFloat(val || 0), 0);
    if (total > 0) summary.push(`${category}: $${total.toFixed(2)}`);
  }

  const prompt = `
You are a financial life coach with a Christian worldview. Based on the following monthly budget summary for ${month}, give encouragement and smart, spiritually sensitive feedback.

Respond in a friendly but purposeful tone. Assume the user is trying to be a good steward and grow in their finances with God's help.

Budget Summary:
${summary.join('\n')}

Avoid judgment. Suggest one or two practical improvements if needed, but prioritize encouragement.

Start your response with: "Here's what I noticed..."
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Something went wrong.';
};
