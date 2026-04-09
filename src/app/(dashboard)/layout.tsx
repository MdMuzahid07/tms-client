"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!token) {
        router.push("/login");
        return;
      }

      const adminRoutes = ["/tasks", "/users", "/audit-logs"];
      const isRoleRestricted = adminRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (user?.role === "USER" && isRoleRestricted) {
        router.push("/my-tasks");
      }

      if (user?.role === "ADMIN" && pathname === "/my-tasks") {
        router.push("/dashboard");
      }
    }
  }, [token, user, pathname, router, isMounted]);

  if (!isMounted || !token || !user) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <div className="lg:pl-60">
        <Topbar />
        <main className="mx-auto max-w-7xl p-4 pt-16 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
