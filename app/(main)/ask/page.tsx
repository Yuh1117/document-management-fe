import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'
import AskPage from '@/features/ask/components/AskPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.pages.ask }
}

export default function Page() {
  // AskPage reads ?id= with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <AskPage />
    </Suspense>
  )
}
