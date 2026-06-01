/*
 * Lightweight Anthropic Claude API client.
 *
 * Calls are made directly from the browser. This is acceptable for a
 * student portfolio project but for production you should proxy through
 * a Supabase Edge Function so the key stays server-side.
 *
 * Set VITE_ANTHROPIC_API_KEY in Vercel → Environment Variables to enable.
 * If the key is not configured the functions return a friendly fallback.
 */

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY?.trim() || '';
const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-haiku-20240307'; // fastest + cheapest, plenty smart enough
const MAX_TOKENS = 600;

export const isAIEnabled = Boolean(API_KEY);

async function callClaude(messages, systemPrompt)
{
  if (!isAIEnabled)
  {
    return null;
  }
  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages
  };
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      // Required for direct browser calls (Anthropic allows this for dev)
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok)
  {
    const err = await response.text().catch(() => '');
    throw new Error(`Anthropic API error ${response.status}: ${err.slice(0, 200)}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text || '';
}

/*
 * Generate a professional explanation of why a student got a question wrong.
 */
export async function explainMistake({ question, studentAnswer, correctAnswer })
{
  if (!isAIEnabled)
  {
    return null;
  }
  const system = `You are an AP Computer Science A teacher explaining exam mistakes.
Be concise (3-5 sentences), precise, and constructive.
Avoid vague encouragement — explain the exact concept the student misunderstood.
Use Java terminology correctly.`;

  const prompt = `Question: ${question.prompt}
${question.code ? `\nCode:\n${question.code}\n` : ''}
Options: ${question.options.map((o, i) => `${['A','B','C','D'][i]}) ${o}`).join(' | ')}
Student chose: ${['A','B','C','D'][studentAnswer]}. Correct answer: ${['A','B','C','D'][correctAnswer]}.

Explain why the student's answer is wrong and why the correct answer is right. Be direct and educational.`;

  return callClaude([{ role: 'user', content: prompt }], system);
}

/*
 * Follow-up chatbot — student asks a question about an exam question.
 */
export async function askFollowUp({ question, conversationHistory, userMessage })
{
  if (!isAIEnabled)
  {
    return null;
  }
  const system = `You are an AP Computer Science A tutor. The student is asking about a specific exam question.
Answer clearly and concisely (max 4 sentences). Use Java-specific terminology.
If the student asks for the direct answer, explain the reasoning instead of just stating it.`;

  const questionContext = `The exam question is: "${question.prompt}"
${question.code ? `Code: ${question.code}` : ''}
${question.options ? `Options: ${question.options.map((o, i) => `${['A','B','C','D'][i]}) ${o}`).join(', ')}` : ''}`;

  const messages = [
    { role: 'user', content: `Context: ${questionContext}\n\nStudent question: ${userMessage}` },
    ...conversationHistory.slice(-6) // keep last 3 exchanges (6 messages)
  ];

  return callClaude(messages, system);
}
