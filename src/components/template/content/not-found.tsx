'use client'

import ImageLoader from '@/components/wrappers/image-loader'
import { cn } from '@/lib/utils'

type NotFoundProps = {
  title?: string
  message?: string
  className?: string
  messageColor?: string
}

export default function NotFound({
  title = 'Tidak ada hasil yang ditemukan',
  message = 'Sumber daya yang diminta tidak ditemukan.',
  className,
  messageColor = 'text-red-500'
}: NotFoundProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center justify-center gap-3">
        <ImageLoader
          src={'/no-data.png'}
          alt="no-data"
          width={150}
          height={150}
        />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className={cn('max-w-lg text-center text-sm', messageColor)}>
          {message}
        </p>
      </div>
    </div>
  )
}
