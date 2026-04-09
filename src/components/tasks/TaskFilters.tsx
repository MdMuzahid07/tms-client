'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetUsersQuery } from '@/redux/feature/users/usersApi'
import { Button } from '@/components/ui/button'
import { TaskStatus } from '@/types'

interface TaskFiltersProps {
  search: string
  setSearch: (val: string) => void
  status: TaskStatus | 'ALL'
  setStatus: (val: TaskStatus | 'ALL') => void
  assignee: string | 'ALL'
  setAssignee: (val: string | 'ALL') => void
}

export function TaskFilters({
  search,
  setSearch,
  status,
  setStatus,
  assignee,
  setAssignee,
}: TaskFiltersProps) {
  const { data: users } = useGetUsersQuery()

  const handleClear = () => {
    setSearch('')
    setStatus('ALL')
    setAssignee('ALL')
  }

  const hasFilters = search !== '' || status !== 'ALL' || assignee !== 'ALL'

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 w-full">
      <div className="relative w-full sm:max-w-xs group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 w-full"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Select
          value={status}
          onValueChange={(val) => setStatus(val as TaskStatus | 'ALL')}
        >
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Users</SelectItem>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="h-10 px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
