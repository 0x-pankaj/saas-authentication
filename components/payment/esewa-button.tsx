"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EsewaButtonProps {
  amount: number;
  productName: string;
}

export function EsewaButton({ amount, productName }: EsewaButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payments/esewa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, productName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Create and submit the eSewa form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.esewaForm.action;

      Object.entries(data.esewaForm.fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toast.error("Payment initiation failed");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      {loading ? "Processing..." : "Pay with eSewa"}
    </Button>
  );
}