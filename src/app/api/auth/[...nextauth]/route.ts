import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
// v4でも @auth/prisma-adapter で動きます。型で怒られる場合は下の注記を参照
import { PrismaAdapter } from "@auth/prisma-adapter";
// もし型で怒られたら：
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,
  // v4には trustHost はありません
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
