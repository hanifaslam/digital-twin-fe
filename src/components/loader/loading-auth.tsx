import { useEffect, useState } from 'react'
import { UserIcon } from '../icons/user-icon'

export default function LoadingAuth() {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-linear-to-br from-background via-muted/20 to-background">
      <div className="flex flex-col items-center space-y-6 p-8 bg-card rounded-xl shadow-lg border animate-in fade-in-0 duration-500">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Checking Session
          </h3>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
          {showHint && (
            <p className="text-xs text-muted-foreground animate-in fade-in-0 duration-500">
              Almost done...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
