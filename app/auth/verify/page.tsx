"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");
  const method = searchParams.get("method");

  const handleVerify = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          otp: method === "EMAIL_OTP" ? otp : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      toast.success("Email verified successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Verify your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {method === "EMAIL_OTP"
              ? "Enter the OTP sent to your email"
              : "Click the button below to verify your email"}
          </p>
        </div>

        {method === "EMAIL_OTP" && (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={loading || (method === "EMAIL_OTP" && !otp)}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </div>
    </div>
  );
}