// src/app/dashboard/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import SignOutButton from "@/components/SignOutButton";

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // 未ログインはトップへ
    // redirect を使う場合は next/navigation から import して使ってOK
    // ここではシンプルにメッセージ表示
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p>サインインしてください。</p>
      </main>
    );
  }

  // 自分のTodoだけ取得
  const rows = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: [{ done: "asc" }, { updatedAt: "desc" }],
  });

  const todos: Todo[] = rows.map((t) => ({
    id: t.id,
    title: t.title,
    done: t.done,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500">
            ようこそ、{session.user.name ?? session.user.email} さん
          </p>
        </div>
        <SignOutButton />
      </header>

      {/* 追加フォーム */}
      <AddTodoForm />

      {/* 一覧 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">あなたのTodo</h2>
        <TodoList todos={todos} />
      </section>
    </main>
  );
}
