"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

type Health = { ok: boolean; time: string };
type Todo = { id: string; title: string; done: boolean; createdAt: string };

export default function Page() {
  const [health, setHealth] = useState<Health | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json() as Promise<Health>)
      .then(setHealth)
      .catch(console.error);
  }, []);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/todos", { cache: "no-store" });

    if (!res.ok) {
      if (res.status === 401) {
        // 未ログイン
        setTodos([]);
        setError("ログインが必要です。");
      } else {
        setError(`取得に失敗しました（${res.status}）`);
      }
      return;
    }

    // 配列 or { todos: 配列 } 両対応（どちらでも落ちないように）
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.todos;
    setTodos(Array.isArray(list) ? list : []);
  }

  // 認証状態が変わったら再読み込み
  useEffect(() => {
    if (status !== "loading") load();
  }, [status]);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // 重要
      body: JSON.stringify({ title: title.trim() }),
    });

    if (!res.ok) {
      setError(res.status === 401 ? "ログインが必要です。" : `追加に失敗しました（${res.status}）`);
      return;
    }

    setTitle("");
    load();
  }

  async function done(id: string) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }, // 重要
      body: JSON.stringify({ done: true }),            // サーバ側に明示
    });
    if (!res.ok) {
      setError(res.status === 401 ? "ログインが必要です。" : `更新に失敗しました（${res.status}）`);
      return;
    }
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError(res.status === 401 ? "ログインが必要です。" : `削除に失敗しました（${res.status}）`);
      return;
    }
    load();
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Welcome</h1>
        {status === "loading" && <p>Loading session...</p>}
        {session ? (
          <>
            <p>Signed in as {session.user?.email ?? session.user?.name}</p>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <button onClick={() => signIn("github")}>Sign in with GitHub</button>
        )}

        <h1>Todos</h1>
        <form onSubmit={add} style={{ display: "flex", gap: 8 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="new todo..."
            style={{ flex: 1, padding: 8 }}
          />
          <button type="submit">Add</button>
        </form>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <ul style={{ marginTop: 24 }}>
          {todos.map((t) => (
            <li key={t.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
              {!t.done && <button onClick={() => done(t.id)}>Done</button>}
              <button onClick={() => remove(t.id)}>Delete</button>
            </li>
          ))}
        </ul>


      <h1>ようこそ！</h1>
      <p>下は /api/health から取得したJSONです：</p>
      <pre>{JSON.stringify(health, null, 2)}</pre>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center sm:text-left">
          こんにちは。
        </h1>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
