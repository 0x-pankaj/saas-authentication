"use client";

import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react";

interface DashboardNavProps {
  user: User & {
    role?: string;
    subscription?: {
      plan: string;
    };
  };
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Pro Features",
    icon: Lock,
    href: "/pro",
    color: "text-violet-500",
    requiresPro: true,
  },
  {
    label: "Enterprise",
    icon: Shield,
    color: "text-green-700",
    href: "/enterprise",
    requiresEnterprise: true,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    label: "Billing",
    icon: CreditCard,
    href: "/pricing",
  },
];

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const isPro = user?.subscription?.plan === "PRO";
  const isEnterprise = user?.subscription?.plan === "ENTERPRISE";

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-100 dark:bg-gray-900 w-72">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => {
            if (route.requiresPro && !isPro && !isEnterprise) return null;
            if (route.requiresEnterprise && !isEnterprise) return null;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition",
                  pathname === route.href
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "transparent",
                  route.color
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center gap-x-4 py-4 px-6 bg-white dark:bg-gray-800 rounded-lg">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}