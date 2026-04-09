"use client";

import { DataTableSkeleton } from "@/components/shared/DataTableSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsersQuery } from "@/redux/feature/users/usersApi";
import { formatDate, getInitials } from "@/utils";

export default function UsersPage() {
  const { data: users, isLoading } = useGetUsersQuery();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mt-16 space-y-6 duration-300">
      <PageHeader
        title="Users"
        subtitle="View and manage system users and their roles."
        action={
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 h-8 rounded px-4"
          >
            {users?.length || 0} Total
          </Badge>
        }
      />

      {isLoading ? (
        <DataTableSkeleton rows={8} cols={4} />
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Member Since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="border-primary/10 h-9 w-9 border">
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {users?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground h-32 text-center"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
