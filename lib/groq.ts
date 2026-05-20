/**
 * 🤖 Groq API client for the AI Astrologer chat.
 * Uses llama3-70b-8192 — fast, high quality for conversational AI.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL        = 'llama3-70b-8192'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface UserAstroContext {
  sunSign?: string
  moonSign?: string
  risingSign?: string
  birthDate?: string
}

export function buildSystemPrompt(ctx: UserAstroContext): string {
  const profile = ctx.sunSign
    ? `The user's Sun is in ${ctx.sunSign}, Moon in ${ctx.moonSign ?? 'unknown'}, and Rising is ${ctx.risingSign ?? 'unknown'}.`
    : 'The user has not yet shared their birth chart details.'

  return `You are Nebula, a wise and intuitive AI astrologer. You blend ancient astrological wisdom with modern psychological insight.

${profile}

Guidelines:
- Speak with warmth, depth, and poetic accuracy. Use celestial metaphors naturally.
- Reference the user's actual chart placements when relevant.
- Give practical, actionable guidance grounded in astrological symbolism.
- Be honest — astrology is a tool for reflection, not determinism.
- Keep responses concise (2–4 paragraphs) unless asked to elaborate.
- Never claim to predict specific events. Frame insights as tendencies and energies.
- If asked about another person, remind the user you only see their own chart.

Today's date: ${new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}`
}

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? '✨ The stars are silent right now. Try again in a moment.'
}
