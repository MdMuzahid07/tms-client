import { Role } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils'

interface RoleBadgeProps {
  role: Role
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const styles = {
    ADMIN: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    USER: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  }

  return (
    <Badge
      variant="outline"
      className={cn('font-medium capitalize', styles[role], className)}
    >
      {role.toLowerCase()}
    </Badge>
  )
}
