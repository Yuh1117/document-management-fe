import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'
import AccountPage from '@/features/account/components/AccountPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.nav.account }
}

export default function Page() {
  return <AccountPage />
}
