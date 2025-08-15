import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // 明示しておく
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // 初回サインイン時に user.id をJWTに格納
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      // クライアント/サーバー両方で session.user.id を使えるように
      if (session.user && token?.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};
