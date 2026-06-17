import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function serverFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })

    if (!res.ok) return null
    const json = await res.json()
    return json.data as T
  } catch {
    return null
  }
}
