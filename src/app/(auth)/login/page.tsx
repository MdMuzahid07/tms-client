import { LoginForm } from "@/components/auth/LoginForm";
import { AppLogo } from "@/components/shared/AppLogo";
import { CheckCircle2, LayoutDashboard, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-size-[32px_32px]" />
      <div className="bg-primary/10 absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Panel - Hero Section */}
        <div className="hidden flex-col space-y-8 pr-8 lg:flex">
          <div className="space-y-4">
            <h1 className="text-foreground flex items-center gap-3 text-5xl font-extrabold tracking-tight">
              <span className="bg-primary/10 border-primary/15 rounded-xl border p-2">
                <AppLogo size={44} priority className="drop-shadow-sm" />
              </span>
              <span>Task System</span>
            </h1>
            <p className="text-muted-foreground max-w-md text-xl leading-relaxed">
              The professional environment to manage your tasks, track progress,
              and stay organized with ease.
            </p>
          </div>

          <div className="space-y-6">
            <FeatureItem
              icon={LayoutDashboard}
              title="Intuitive Dashboard"
              description="Get a bird's eye view of your entire workflow in one place."
            />
            <FeatureItem
              icon={ShieldCheck}
              title="Role-Based Security"
              description="Granular access control for admins and team members."
            />
            <FeatureItem
              icon={CheckCircle2}
              title="Activity Tracking"
              description="Detailed audit logs and timeline of every task update."
            />
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex w-full justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-start gap-4">
      <div className="bg-primary/5 border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded border transition-all">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div>
        <h3 className="text-foreground font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
      </div>
    </div>
  );
}
