"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    features: ["Basic features", "Limited access", "Community support"],
    buttonText: "Get Started",
    priceId: "free",
  },
  {
    name: "Pro",
    description: "Best for professionals",
    price: "$9.99",
    features: [
      "Everything in Free",
      "Advanced features",
      "Priority support",
      "API access",
    ],
    buttonText: "Subscribe",
    priceId: "pro",
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "$29.99",
    features: [
      "Everything in Pro",
      "Custom solutions",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
    ],
    buttonText: "Contact Sales",
    priceId: "enterprise",
  },
];

export function PricingCards() {
  const router = useRouter();

  const handleSubscribe = async (priceId: string, price: string) => {
    try {
      // Simulate subscription process
      <EsewaButton amount={Number(price)} productName={priceId} />
      toast.success("Subscription successful! (Demo)");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-3xl font-bold mb-4">{plan.price}</div>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(plan.priceId, plan.price)}
            >
              {plan.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}