import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type VariantProps } from 'class-variance-authority'

type BaseVariant = VariantProps<typeof buttonVariants>['variant']
type BaseSize = VariantProps<typeof buttonVariants>['size']
type ExtraVariant = 'tertiary' | 'select'

const extra: Record<ExtraVariant, string> = {
  tertiary:
    'border text-primary bg-background shadow-xs hover:bg-accent hover:text-black dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
  select:
    'border text-black bg-background shadow-xs hover:bg-background hover:text-primary dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:border-primary'
}

type Props = Omit<React.ComponentProps<'button'>, 'color'> & {
  asChild?: boolean
  size?: BaseSize
  variant?: BaseVariant | ExtraVariant
  loading?: boolean
}

export function AppButton({
  variant = 'default',
  size = 'default',
  className,
  loading,
  ...rest
}: Props) {
  const isExtra = variant === 'tertiary' || variant === 'select'
  const baseVariant: BaseVariant = isExtra
    ? 'outline'
    : (variant as BaseVariant)

  return (
    <Button
      variant={baseVariant}
      size={size}
      className={cn(
        isExtra && extra[variant as ExtraVariant],
        'min-w-[100px]',
        className
      )}
      disabled={loading || rest.disabled}
      {...rest}
    />
  )
}
