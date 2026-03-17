'use client'

import { ProgressProvider } from '@bprogress/next/app'

const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider color="#1b3250" options={{ showSpinner: false }}>
      {children}
    </ProgressProvider>
  )
}

export default NProgressProvider
