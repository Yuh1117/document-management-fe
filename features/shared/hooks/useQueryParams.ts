'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation'

export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useNextSearchParams()

  const setSearchParams = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [router, pathname]
  )

  return [new URLSearchParams(searchParams.toString()), setSearchParams]
}
