import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashIp, isLockedOut, loginWindowStart } from "@/lib/security";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(128),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase().trim();
        const ip = hashIp(
          (req as { headers?: { "x-forwarded-for"?: string } })?.headers?.[
            "x-forwarded-for"
          ]?.split(",")[0] || "local"
        );

        const recentFails = await prisma.loginAttempt.count({
          where: {
            email,
            success: false,
            createdAt: { gte: loginWindowStart() },
          },
        });

        if (isLockedOut(recentFails)) {
          // Do not throw — NextAuth surfaces throws as generic failures
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
          await prisma.loginAttempt.create({
            data: { email, ip, success: false },
          });
          return null;
        }

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) {
          await prisma.loginAttempt.create({
            data: { email, ip, success: false, userId: user.id },
          });
          return null;
        }

        await prisma.loginAttempt.create({
          data: { email, ip, success: true, userId: user.id },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "admin";
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.uid as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
