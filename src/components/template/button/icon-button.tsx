import { AppButton } from '@/components/wrappers/app-button'
import * as React from 'react'

interface CButtonProps extends React.ComponentProps<typeof AppButton> {
  icon?: React.ReactNode
  title: string
}

export default function IconButton({
  icon,
  title,
  children,
  ...props
}: CButtonProps) {
  return (
    <AppButton {...props}>
      {icon}
      {title}
      {children}
    </AppButton>
  )
}
