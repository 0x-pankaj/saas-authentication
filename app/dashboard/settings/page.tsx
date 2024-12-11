import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{session.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <p className="capitalize">{session.user.subscription?.plan || "Free"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}