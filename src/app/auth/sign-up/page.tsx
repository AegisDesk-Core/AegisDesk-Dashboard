"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/checkout?plan=professional");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Redirecting to plan checkout and registration...</p>
      </div>
    </div>
  );
}
