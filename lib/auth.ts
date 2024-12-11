import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";

import { Subscription, UserRole } from "@prisma/client";

// Add these type declarations at the top of the file
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      subscription?: Subscription | null;
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole;
    subscription?: Subscription | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    subscription?: Subscription | null;
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            subscription: true,
          }
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          subscription: user.subscription,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        const user = await db.user.findUnique({
          where: { id: token.sub },
          include: { subscription: true },
        });
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            role: user?.role,
            subscription: user?.subscription,
          },
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role,
          subscription: user.subscription,
        };
      }
      return token;
    },
  },
};