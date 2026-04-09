import Image from 'next/image'
import { cn } from '@/utils'

const LOGO_SRC = '/logo/tms-logo.png'

export function AppLogo({
  className,
  size = 32,
  alt = 'Logo',
  priority = false,
}: {
  className?: string
  size?: number
  alt?: string
  priority?: boolean
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn('shrink-0', className)}
    />
  )
}

