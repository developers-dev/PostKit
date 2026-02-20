// apps/web/src/lib/openai/client.ts

import OpenAI from 'openai'

export function createOpenAIClient(clientApiKey?: string) {
  const apiKey = clientApiKey || process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  return new OpenAI({
    apiKey,
  })
}
