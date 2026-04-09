import { TaskStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { getStatusColor, cn } from '@/utils'

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium capitalize text-[10px] sm:text-xs', getStatusColor(status), className)}
    >
      {status.toLowerCase()}
    </Badge>
  )
}
