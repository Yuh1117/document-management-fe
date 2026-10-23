import axios from 'axios'
import { endpoints } from '@/lib/endpoints'
import { getAcceptLanguage } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { IRagSource } from '@/types/type'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface AskHandlers {
  onSources: (sources: IRagSource[]) => void
  onToken: (text: string) => void
  onDone: (model: string | null) => void
  onError: (message: string | null) => void
}

export class AskHttpError extends Error {
  status: number

  constructor(status: number) {
    super(`Ask request failed with status ${status}`)
    this.status = status
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      BASE_URL + endpoints['refresh'],
      {},
      {
        withCredentials: true,
        headers: { 'Accept-Language': getAcceptLanguage(), 'ngrok-skip-browser-warning': 'true' },
      }
    )
    const token = res.data.data.accessToken as string
    useAuthStore.getState().setAccessToken(token)
    return token
  } catch {
    return null
  }
}

function sendRequest(question: string, signal: AbortSignal): Promise<Response> {
  const token = useAuthStore.getState().accessToken
  return fetch(BASE_URL + endpoints['rag-ask'], {
    method: 'POST',
    credentials: 'include',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, application/json',
      'Accept-Language': getAcceptLanguage(),
      'ngrok-skip-browser-warning': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ question }),
  })
}

function dispatch(rawEvent: string, handlers: AskHandlers) {
  let event = 'message'
  const dataLines: string[] = []

  for (const line of rawEvent.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''))
  }
  if (dataLines.length === 0) return

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(dataLines.join('\n'))
  } catch {
    return
  }

  switch (event) {
    case 'sources':
      handlers.onSources((payload.sources as IRagSource[]) ?? [])
      break
    case 'token':
      handlers.onToken(String(payload.text ?? ''))
      break
    case 'done':
      handlers.onDone((payload.model as string | null) ?? null)
      break
    case 'error':
      handlers.onError((payload.message as string | undefined) ?? null)
      break
  }
}

export async function streamAsk(question: string, handlers: AskHandlers, signal: AbortSignal) {
  let res = await sendRequest(question, signal)

  if (res.status === 401) {
    const token = await refreshAccessToken()
    if (!token) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      throw new AskHttpError(401)
    }
    res = await sendRequest(question, signal)
  }

  if (!res.ok || !res.body) throw new AskHttpError(res.status)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')

    let boundary = buffer.indexOf('\n\n')
    while (boundary !== -1) {
      dispatch(buffer.slice(0, boundary), handlers)
      buffer = buffer.slice(boundary + 2)
      boundary = buffer.indexOf('\n\n')
    }
  }
}
