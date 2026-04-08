"use client";

import TMSForm from "@/components/form/TMSForm";
import TMSInput from "@/components/form/TMSInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/redux/api/baseApi";
import { useLoginMutation } from "@/redux/feature/auth/authApi";
import { setCredentials } from "@/redux/feature/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, AtSign, KeyRound, Lock, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid corporate identity format"),
  password: z
    .string()
    .min(6, "Security protocol requires at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const TEST_ACCOUNTS = {
  admin: { email: "admin@tms.com", password: "Admin@123" },
  user: { email: "user@tms.com", password: "User@123" },
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const getErrorMessage = (err: unknown): string => {
    const e = err as {
      status?: number | string;
      data?: { message?: string | { message?: string } | string[] };
      error?: string;
    };

    if (e?.status === "FETCH_ERROR") {
      return `Cannot reach backend server (${API_BASE_URL}). If using LAN URL, set NEXT_PUBLIC_BACKEND_URL to your server host (e.g. http://192.168.x.x:5000).`;
    }

    const message = e?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message) && message.length > 0) return message[0] as string;
    if (typeof message === "object" && message && "message" in message) {
      return String(message.message);
    }

    return e?.error || "Authentication attempt rejected.";
  };

  const handleLogin = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
        }),
      );
      toast.success(`Authenticated as ${res.data.user.name}`);
      router.push("/");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const loginAsTestUser = async (key: keyof typeof TEST_ACCOUNTS) => {
    const account = TEST_ACCOUNTS[key];
    await handleLogin(account);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[460px] space-y-7 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <header className="space-y-4">
          <Badge className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-slate-700 uppercase hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
            Task Management System
          </Badge>
          <h1 className="text-3xl leading-none font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sign In
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Use your account credentials or quick test login.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => loginAsTestUser("admin")}
            className="h-10 justify-start rounded-lg border-slate-200 bg-slate-50 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-indigo-600" />
            Admin Login
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => loginAsTestUser("user")}
            className="h-10 justify-start rounded-lg border-slate-200 bg-slate-50 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <User className="mr-2 h-4 w-4 text-emerald-600" />
            User Login
          </Button>
        </div>

        <TMSForm
          onSubmit={handleLogin}
          resolver={zodResolver(loginSchema)}
          defaultValues={{ email: "", password: "" }}
        >
          <div className="space-y-7">
            <div className="space-y-2.5">
              <Label className="px-1 text-[10px] font-black tracking-[0.2em] text-[#3b82f6] uppercase">
                Email Address
              </Label>
              <TMSInput
                name="email"
                placeholder="admin@tms.com"
                startIcon={<AtSign size={18} className="text-slate-400" />}
                className="h-11 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[10px] font-black tracking-[0.2em] text-[#3b82f6] uppercase">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-[10px] font-black tracking-widest text-[#3b82f6] uppercase transition-colors hover:text-[#2563eb]"
                >
                  Forgot?
                </button>
              </div>
              <TMSInput
                name="password"
                type="password"
                placeholder="••••••••"
                startIcon={<Lock size={18} className="text-slate-400" />}
                className="h-11 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center space-x-3 px-1">
              <Checkbox
                id="remember"
                className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:border-[#3b82f6] data-[state=checked]:bg-[#3b82f6]"
              />
              <label
                htmlFor="remember"
                className="cursor-pointer text-[14px] font-bold text-slate-400 select-none"
              >
                Remember this device
              </label>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <div className="mb-1 flex items-center gap-2 font-semibold uppercase tracking-wide">
                <KeyRound size={14} />
                Test Credentials
              </div>
              <p>Admin: admin@tms.com / Admin@123</p>
              <p>User: user@tms.com / User@123</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-slate-900 text-sm font-semibold tracking-wide text-white transition hover:bg-slate-800 active:scale-[0.99] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
                isLoading && "opacity-80",
              )}
            >
              {isLoading ? "Authenticating Unit..." : "Sign In"}
              {!isLoading && <ArrowRight size={18} strokeWidth={3} />}
            </Button>
          </div>
        </TMSForm>
      </motion.div>
    </div>
  );
}
