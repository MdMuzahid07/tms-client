"use client";

import { AppLogo } from "@/components/shared/AppLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from "@/constants";
import { logout } from "@/redux/feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn, getInitials } from "@/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleBadge } from "../shared/RoleBadge";

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = user?.role === "ADMIN" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user) return null;

  return (
    <aside className="bg-card fixed inset-y-0 z-50 hidden w-60 flex-col border-r lg:flex">
      {/* Logo Area */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo size={32} priority />
          <span className="text-xl font-bold tracking-tight">TMS</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-4 border-t p-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="border-primary/20 h-9 w-9 border-2">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <RoleBadge
              role={user.role}
              className="-mt-0.5 w-fit origin-left scale-75"
            />
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-9 w-full justify-start gap-3 rounded text-red-400 hover:bg-red-500/10 hover:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
