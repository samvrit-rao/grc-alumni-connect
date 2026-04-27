"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [providers, setProviders] = useState<Awaited<ReturnType<typeof getProviders>>>(null);
  const [email, setEmail] = useState("admin@columbia.edu");

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <div>
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-columbia-blue flex items-center justify-center mb-4">
            <span className="text-navy font-bold text-lg">GRC</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-columbia-blue/80 mt-2">Sign in with your Columbia email</p>
        </div>
      </div>

      <div className="flex justify-center -mt-8 px-4">
        <Card className="w-full max-w-sm border-slate-200 shadow-lg">
          <CardContent className="p-6 space-y-4">
            {providers?.google && (
              <Button
                className="w-full bg-navy hover:bg-navy-light text-white"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Sign in with Google
              </Button>
            )}

            {providers?.credentials && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Dev login</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@columbia.edu"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn("credentials", { email, callbackUrl: "/" })}
                >
                  Dev Sign In
                </Button>
              </>
            )}

            <p className="text-[10px] text-center text-slate-400">
              Only @columbia.edu emails are allowed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
