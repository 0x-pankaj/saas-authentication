import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EnterprisePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.subscription || session.user.subscription.plan !== "ENTERPRISE") {
    redirect("/pricing?upgrade=enterprise");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Enterprise Features</h1>
      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Custom Solutions</h2>
          <p className="text-muted-foreground">
            Access to custom-built solutions for your specific needs.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Dedicated Support</h2>
          <p className="text-muted-foreground">
            24/7 dedicated support team with guaranteed response times.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Advanced Security</h2>
          <p className="text-muted-foreground">
            Enterprise-grade security features and compliance tools.
          </p>
        </div>
      </div>
    </div>
  );
}