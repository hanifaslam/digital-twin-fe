import LoadingCircle from './loading-circle'

interface LoadingSpinningProps {
  message?: string
  fullHeight?: boolean
  height?: number | string
}

export default function LoadingSpinning({
  message,
  fullHeight = true,
  height
}: LoadingSpinningProps) {
  const className = fullHeight
    ? 'flex items-center justify-center'
    : 'flex items-center justify-center py-6'

  const style = height
    ? { minHeight: typeof height === 'number' ? `${height}px` : height }
    : fullHeight
      ? { minHeight: '100vh' }
      : undefined

  return (
    <div className={className} style={style}>
      <div className="flex flex-col items-center justify-center space-y-2">
        <LoadingCircle />
        <p className="text-gray-600 text-sm">{message || 'Please wait...'}</p>
      </div>
    </div>
  )
}
