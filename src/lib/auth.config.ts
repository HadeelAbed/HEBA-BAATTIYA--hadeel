import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config (no Prisma, no bcrypt) used by middleware.
 * The full config with the database adapter lives in `src/lib/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      // ADMIN_EMAILS env whitelist — promote these accounts to admin automatically.
      const adminList = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (token.email && adminList.includes(String(token.email).toLowerCase())) {
        token.role = "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "CUSTOMER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
