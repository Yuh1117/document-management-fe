/**
 * USD per 1M tokens (OpenAI standard pricing, checked 2026-11-20; update when
 * the model changes). Models not listed (e.g. Ollama) have no cost estimate.
 */
const OPENAI_PRICE: Record<string, { in: number; cached?: number; out: number }> = {
  'gpt-6-luna': { in: 0.1, cached: 0.01, out: 0.5 },
  'gpt-6.1-terra': { in: 1, cached: 0.05, out: 5 },
  'gpt-6.2-sol': { in: 2, cached: 0.1, out: 10 },
  'gpt-6.2-astra': { in: 8, cached: 0.4, out: 40 },
}

export interface TokenCounts {
  inputTokens: number
  cachedTokens: number
  outputTokens: number
}

/** Estimated cost in USD, or null when the model's price is unknown. */
export const estimateCost = (tokens: TokenCounts, model: string | null): number | null => {
  const price = model ? OPENAI_PRICE[model.replace(/^openai\//, '')] : undefined
  if (!price) return null
  // Cached tokens are part of the input count, billed at the cached rate.
  const fresh = tokens.inputTokens - tokens.cachedTokens
  return (
    (fresh * price.in +
      tokens.cachedTokens * (price.cached ?? price.in) +
      tokens.outputTokens * price.out) /
    1e6
  )
}

export const formatUsd = (v: number) =>
  v === 0 ? '$0' : v < 0.01 ? `$${v.toFixed(4)}` : `$${v.toFixed(2)}`

export const formatNumber = (v: number) => v.toLocaleString()
