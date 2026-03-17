'use client'

import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface ImageLoaderProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  showLoading?: boolean
  loadingClassName?: string
  onLoadComplete?: () => void
  fallbackSrc?: string
}

export default function ImageLoader({
  src,
  alt,
  showLoading = true,
  loadingClassName,
  className,
  onLoadComplete,
  fallbackSrc = '/logo.png',
  ...props
}: ImageLoaderProps) {
  const [loading, setLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
    setLoading(true)
  }, [src])

  const handleLoad = () => {
    setLoading(false)
    onLoadComplete?.()
  }

  const handleError = () => {
    setLoading(false)
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
    onLoadComplete?.()
  }

  return (
    <div className="relative w-full h-full">
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-200',
          loading && showLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
      />

      {loading && showLoading && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse rounded bg-gray-200',
            loadingClassName
          )}
        />
      )}
    </div>
  )
}
