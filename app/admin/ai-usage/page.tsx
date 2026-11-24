import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'
import AiUsagePage from '@/features/admin/components/AiUsagePage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: `${t.admin.ai_usage} | Admin` }
}

export default function AdminAiUsagePage() {
  return <AiUsagePage />
}
