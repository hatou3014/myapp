import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // ← JWT戦略でもUser/Accountの保存に使えます
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      // 初回サインイン時のみ user が存在。user.id をJWTへ
      if (user && !token.id) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      // 型拡張済みなので any 不要で代入できる
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
