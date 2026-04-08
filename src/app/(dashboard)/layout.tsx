"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { logout, selectCurrentUser } from "@/redux/feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  CheckSquare,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User as UserIcon,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const routes = [
    { label: "Overview", icon: LayoutDashboard, href: "/", active: pathname === "/" || pathname === "" },
    { label: "Tasks", icon: CheckSquare, href: "/tasks", active: pathname.startsWith("/tasks") },
    { label: "Users", icon: Users, href: "/users", active: pathname.startsWith("/users"), adminOnly: true },
    { label: "Audit Logs", icon: History, href: "/audit-logs", active: pathname.startsWith("/audit-logs"), adminOnly: true },
  ];

  const NavItem = ({
    route,
    collapsed,
    onClick,
  }: {
    route: any;
    collapsed?: boolean;
    onClick?: () => void;
  }) => (
    <Link 
      href={route.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        route.active 
          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      )}
    >
      <route.icon size={18} />
      {!collapsed && <span>{route.label}</span>}
    </Link>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-base text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className={cn(
        "hidden border-r border-slate-200 bg-white/95 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 md:flex",
        isSidebarOpen ? "w-64" : "w-20",
      )}>
        <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-slate-800">
          {isSidebarOpen ? (
            <div>
              <p className="text-lg font-bold tracking-tight">Task Manager</p>
              <p className="text-sm text-slate-500">Workspace</p>
            </div>
          ) : (
            <p className="text-base font-semibold">TM</p>
          )}
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {routes.map((route) => {
            if (route.adminOnly && user.role !== "ADMIN") return null;
            return <NavItem key={route.href} route={route} collapsed={!isSidebarOpen} />;
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
           <Button 
            variant="ghost" 
            size={isSidebarOpen ? "default" : "icon"}
            className={cn(
               "w-full gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40",
               isSidebarOpen && "justify-start",
            )}
            onClick={() => dispatch(logout())}
           >
              <LogOut size={16} />
              {isSidebarOpen && <span>Sign Out</span>}
           </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 md:px-8 dark:border-slate-800 dark:bg-slate-900">
           <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex">
                <Menu size={20} />
              </Button>
              <Sheet>
                 <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                       <Menu size={20} />
                    </Button>
                 </SheetTrigger>
                 <SheetContent side="left" className="w-72 p-0">
                    <div className="flex h-16 items-center border-b px-5 text-sm font-semibold">Task Manager</div>
                    <div className="space-y-1 p-3">
                       {routes.map((route) => {
                         if (route.adminOnly && user.role !== "ADMIN") return null;
                         return <NavItem key={route.href} route={route} onClick={() => {}} />;
                       })}
                    </div>
                 </SheetContent>
              </Sheet>

              <div>
                <p className="text-base font-semibold">{routes.find((r) => r.active)?.label || "Overview"}</p>
                <p className="text-sm text-slate-500">Welcome, {user.name}</p>
              </div>
           </div>

           <div className="flex items-center gap-2">
                 <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                 >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
                 
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-10 rounded-lg border-slate-200 px-3.5 text-sm dark:border-slate-700">
                        {user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                       <DropdownMenuItem onClick={() => router.push("/profile")} className="gap-2">
                          <UserIcon size={16} /> Profile
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => dispatch(logout())} className="gap-2 text-red-600 focus:text-red-700">
                          <LogOut size={16} /> Sign Out
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto">
           <div className="mx-auto max-w-7xl p-6 md:p-8">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
