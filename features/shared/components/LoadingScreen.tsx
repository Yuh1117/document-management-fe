'use client'

import { Spinner } from '@/components/ui/spinner'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <Spinner size={40} />
    </div>
  )
}

export default LoadingScreen
