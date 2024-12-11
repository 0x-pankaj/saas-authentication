import { PricingCards } from "@/components/subscription/pricing-cards";

export default function PricingPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for you
          </p>
        </div>
        <PricingCards />
      </div>
    </div>
  );
}