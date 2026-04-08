"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="mb-2 text-4xl font-black tracking-tighter">Something went wrong!</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or contact support if the issue persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-indigo-600 px-8 font-bold">
          Try Again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")} className="font-bold">
          Go to Home
        </Button>
      </div>
    </div>
  );
}
