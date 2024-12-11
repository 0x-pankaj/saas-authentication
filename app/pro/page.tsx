import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.subscription || session.user.subscription.plan === "FREE") {
    redirect("/pricing?upgrade=pro");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Pro Features</h1>
      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Access detailed insights and analytics about your usage.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Priority Support</h2>
          <p className="text-muted-foreground">
            Get faster responses from our dedicated support team.
          </p>
        </div>
      </div>
    </div>
  );
}