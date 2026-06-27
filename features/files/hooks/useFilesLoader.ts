'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { IFileItem } from '@/types/type'
import api, { endpoints } from '@/lib/api'

type DocumentProcessingStatus = {
  id: number
  processingStatus: string | null
}

const MAX_NOT_PROCESSED_STATUS_CHECKS = 12

export function useFilesLoader(
  endpoint: string | null,
  reloadFlag?: unknown,
  query?: string | Record<string, string>,
  initialItems?: IFileItem[]
) {
  const [files, setFiles] = useState<IFileItem[]>(initialItems ?? [])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadKey, setLoadKey] = useState<boolean>(false)
  const observerRef = useRef<HTMLDivElement | null>(null)
  const notProcessedStatusCheckCountRef = useRef<Map<number, number>>(new Map())
  const skipFirstPageLoad = useRef(!!initialItems?.length)

  const stableQuery = useMemo(() => {
    const params = new URLSearchParams()
    if (query && typeof query === 'string') {
      params.set('kw', query)
    } else if (query && typeof query === 'object') {
      for (const [key, value] of Object.entries(query)) {
        if (value) params.set(key, value)
      }
    }
    return params
  }, [JSON.stringify(query)])

  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams(stableQuery)
    params.set('page', pageNumber.toString())

    return `${endpoint}?${params.toString()}`
  }

  const loadFiles = async () => {
    try {
      setLoading(true)

      const url = buildUrl(page)
      const res = await api.get(url)
      const data = res.data.data

      setFiles((prev) => [...prev, ...data.result])
      setHasMore(data.result.length > 0)

      if (data.result.length === 0) setPage(0)
    } catch (err) {
      console.error(err)
      setHasMore(false)
      setPage(0)
    } finally {
      setLoading(false)
    }
  }

  const getStatusPollingDocumentIds = () => {
    return files
      .filter((file) => {
        if (file.type !== 'document' || !file.document) return false

        if (file.document.processingStatus === 'PROCESSING') return true
        if (file.document.processingStatus) return false

        const checkCount = notProcessedStatusCheckCountRef.current.get(file.document.id) ?? 0
        return checkCount < MAX_NOT_PROCESSED_STATUS_CHECKS
      })
      .map((file) => file.document.id)
  }

  const refreshProcessingStatuses = async () => {
    const documentIds = getStatusPollingDocumentIds()

    if (documentIds.length === 0) return

    try {
      const res = await api.post(endpoints['document-processing-status'], documentIds)
      const statuses = res.data.data as DocumentProcessingStatus[]
      const statusMap = new Map(statuses.map((status) => [status.id, status.processingStatus]))

      setFiles((prev) =>
        prev.map((file) => {
          if (file.type !== 'document' || !file.document || !statusMap.has(file.document.id)) {
            return file
          }

          return {
            ...file,
            document: {
              ...file.document,
              processingStatus: statusMap.get(file.document.id) ?? null,
            },
          }
        })
      )

      for (const documentId of documentIds) {
        const status = statusMap.get(documentId)
        if (status) {
          notProcessedStatusCheckCountRef.current.delete(documentId)
          continue
        }

        const checkCount = notProcessedStatusCheckCountRef.current.get(documentId) ?? 0
        notProcessedStatusCheckCountRef.current.set(documentId, checkCount + 1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (skipFirstPageLoad.current && page === 1) {
      skipFirstPageLoad.current = false
      return
    }
    if (endpoint && page > 0) loadFiles()
  }, [page, loadKey])

  useEffect(() => {
    if (skipFirstPageLoad.current) {
      setPage(1)
      setHasMore(true)
      return
    }
    setFiles([])
    notProcessedStatusCheckCountRef.current.clear()
    setPage(1)
    setHasMore(true)
    setLoadKey((prev) => !prev)
  }, [reloadFlag, endpoint, stableQuery])

  useEffect(() => {
    if (getStatusPollingDocumentIds().length === 0) return

    const interval = window.setInterval(refreshProcessingStatuses, 5000)
    return () => window.clearInterval(interval)
  }, [files])

  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page > 0 && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1.0 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [hasMore, loading, page])

  return { files, loading, hasMore, observerRef }
}
