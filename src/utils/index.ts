import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  if (!dateStr) return 'N/A'
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatDateTime(dateStr: string) {
  if (!dateStr) return 'N/A'
  return format(parseISO(dateStr), 'MMM d, yyyy HH:mm')
}

export function formatRelative(dateStr: string) {
  if (!dateStr) return 'N/A'
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

export function getInitials(name: string) {
  if (!name) return '??'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'PROCESSING':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'DONE':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    default:
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  }
}

export function getActionColor(action: string) {
  switch (action) {
    case 'TASK_CREATED':
      return 'bg-emerald-500/10 text-emerald-400'
    case 'TASK_UPDATED':
      return 'bg-blue-500/10 text-blue-400'
    case 'TASK_DELETED':
      return 'bg-red-500/10 text-red-400'
    case 'TASK_STATUS_CHANGED':
      return 'bg-amber-500/10 text-amber-400'
    case 'TASK_ASSIGNED':
      return 'bg-violet-500/10 text-violet-400'
    default:
      return 'bg-zinc-500/10 text-zinc-400'
  }
}

export function truncate(str: string | null, len: number) {
  if (!str) return ''
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}
