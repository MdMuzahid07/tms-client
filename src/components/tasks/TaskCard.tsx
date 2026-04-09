'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { TaskWithAssignee } from '@/types'
import { TaskStatusBadge } from './TaskStatusBadge'
import { formatDate, cn } from '@/utils'
import { UpdateStatusForm } from './UpdateStatusForm'

interface TaskCardProps {
  task: TaskWithAssignee
}

export function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      layout
      className={cn(
        'rounded-xl border bg-card transition-all duration-200 overflow-hidden',
        isExpanded ? 'ring-2 ring-primary/20 shadow-lg' : 'hover:border-primary/30 hover:shadow-sm'
      )}
    >
      <div 
        className="p-5 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <TaskStatusBadge status={task.status} />
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        
        <h3 className="font-semibold text-foreground leading-tight">
          {task.title}
        </h3>
        
        {!isExpanded && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {task.description || 'No description provided.'}
          </p>
        )}

        <div className="flex items-center gap-2 mt-4 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          <Calendar className="h-3 w-3" />
          Assigned {formatDate(task.createdAt)}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t"
          >
            <div className="p-5 pt-4 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Full Description
                </h4>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Update Status
                </h4>
                <UpdateStatusForm 
                  taskId={task.id} 
                  currentStatus={task.status} 
                  onSuccess={() => setIsExpanded(false)} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
