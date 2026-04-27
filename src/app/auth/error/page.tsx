"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    AccessDenied: "Only @columbia.edu email addresses are allowed.",
    Configuration: "Server configuration error. Please contact an admin.",
    Default: "An authentication error occurred.",
  };

  return (
    <p className="text-sm text-slate-600">
      {errorMessages[error || "Default"] || errorMessages.Default}
    </p>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600">Sign In Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Suspense fallback={<p className="text-sm text-slate-600">Loading...</p>}>
            <ErrorContent />
          </Suspense>
          <Link href="/auth/signin">
            <Button variant="outline">Try again</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
