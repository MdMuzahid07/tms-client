import { AuditAction } from '@/types'
import { Badge } from '@/components/ui/badge'
import { getActionColor, cn } from '@/utils'

interface AuditActionBadgeProps {
  action: AuditAction
  className?: string
}

export function AuditActionBadge({ action, className }: AuditActionBadgeProps) {
  const label = action.replace(/_/g, ' ')

  return (
    <Badge
      variant="outline"
      className={cn('font-medium capitalize text-[10px]', getActionColor(action), className)}
    >
      {label.toLowerCase()}
    </Badge>
  )
}
