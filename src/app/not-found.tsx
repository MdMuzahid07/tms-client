import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <SearchX className="h-10 w-10 text-slate-600 dark:text-slate-400" />
      </div>
      <h1 className="mb-2 text-4xl font-black tracking-tighter">Page Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you are looking for doesn't exist or has been moved to a new location.
      </p>
      <Button asChild className="bg-indigo-600 px-8 font-bold">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
