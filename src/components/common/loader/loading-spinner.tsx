import React from 'react'

interface LoadingSpinnerProps {
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full border border-white border-t-transparent ${className}`}
    ></div>
  )
}

export default LoadingSpinner
