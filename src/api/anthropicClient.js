/*
 * Anthropic Claude API client.
 *
 * Calls are proxied from the browser. This is fine for a student portfolio
 * project. For production, proxy through a Supabase Edge Function.
 *
 * To enable AI features:
 *   1. Get a free API key at https://console.anthropic.com
 *   2. In Vercel → Project Settings → Environment Variables, add:
 *      VITE_ANTHROPIC_API_KEY = sk-ant-...
 *   3. Redeploy. The AI tutor and explanations will activate automatically.
 *
 * Without the key, the static explanation from exams.js still shows — the
 * chat box is the only part that requires the key.
 */

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY?.trim() || '';
const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5'; // fastest + cheapest, great for explanations
const MAX_TOKENS = 500;

export const isAIEnabled = Boolean(API_KEY);

async function callClaude(messages, systemPrompt)
{
  if (!isAIEnabled)
  {
    return null;
  }
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages
    })
  });
  if (!response.ok)
  {
    const err = await response.text().catch(() => '');
    throw new Error(`API error ${response.status}: ${err.slice(0, 200)}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text || '';
}

/*
 * explainMistake — called with (question, userAnswerIndex).
 * Returns a 3-5 sentence explanation or null if AI is disabled.
 */
export async function explainMistake(question, userAnswerIndex)
{
  if (!isAIEnabled)
  {
    return null;
  }
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  const system = `You are an AP Computer Science A teacher giving concise, precise feedback on exam mistakes.
Be educational, direct, and use correct Java terminology.
Never use vague encouragement. Max 4 sentences total.`;

  const prompt = `Question: "${question.prompt}"
${question.code ? `\nCode:\n${question.code}\n` : ''}
Options: ${question.options.map((o, i) => `${LETTERS[i]}) ${o}`).join(' | ')}
Student chose: ${LETTERS[userAnswerIndex] || '?'} — Correct answer: ${LETTERS[question.answer]}

Explain in 2-3 sentences: (1) why the student's choice is wrong, (2) why the correct answer is right. Be concrete.`;

  return callClaude([{ role: 'user', content: prompt }], system);
}

/*
 * askFollowUp — called with (context, userMessage, previousMessages[]).
 * context = { question, userAnswer, explanation }
 */
export async function askFollowUp(context, userMessage, previousMessages = [])
{
  if (!isAIEnabled)
  {
    return null;
  }
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  const system = `You are a friendly AP Computer Science A tutor. Answer clearly in 2-4 sentences.
Use correct Java terminology. If the student asks for the answer directly, explain the reasoning instead.`;

  const qContext = `Exam question: "${context.question?.prompt || ''}"
${context.question?.code ? `Code: ${context.question.code}` : ''}
${context.question?.options ? `Options: ${context.question.options.map((o, i) => `${LETTERS[i]}) ${o}`).join(', ')}` : ''}
${context.explanation ? `Explanation already shown: "${context.explanation}"` : ''}`;

  // Build message history: first message includes the question context
  const history = previousMessages
    .slice(-6)
    .map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

  const messages = [
    { role: 'user', content: `Context:\n${qContext}\n\nStudent asks: ${userMessage}` },
    ...history
  ];

  return callClaude(messages, system);
}
