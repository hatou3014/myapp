// src/app/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Welcome</h1>
        {session ? <SignOutButton /> : <SignInButton provider="github" />}
      </header>

      {session ? (
        <section className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-600">
            ようこそ、{session.user?.name ?? session.user?.email} さん。
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-xl border bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              ダッシュボードへ
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">自分だけのTodoを管理しよう</h2>
          <p className="mt-1 text-sm text-gray-600">
            サインインすると、あなた専用のダッシュボードでTodoを追加・編集できます。
          </p>
          <div className="mt-4">
            <SignInButton provider="github" />
          </div>
        </section>
      )}
    </main>
  );
}
