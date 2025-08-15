"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

// ボタンの状態をユニオン型で厳密化
type LoadingKind = "toggle" | "delete" | null;

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [loading, setLoading] = useState<LoadingKind>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleDone() {
    setError(null);
    setLoading("toggle");
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done }),
      });
      if (!res.ok) {
        // サーバーが message を返す場合も拾う
        const body = await res.json().catch(() => ({} as { message?: string }));
        throw new Error(body?.message ?? `Failed: ${res.status}`);
      }
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "不明なエラーが発生しました");
    } finally {
      setLoading(null);
    }
  }

  async function remove() {
    if (!confirm("削除しますか？")) return;
    setError(null);
    setLoading("delete");
    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as { message?: string }));
        throw new Error(body?.message ?? `Failed: ${res.status}`);
      }
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "不明なエラーが発生しました");
    } finally {
      setLoading(null);
    }
  }

  return (
    <li className="group flex items-start justify-between gap-3 rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md">
      <div className="flex min-w-0 items-start gap-3">
        <button
          onClick={toggleDone}
          aria-label={todo.done ? "未完了にする" : "完了にする"}
          className={`mt-1 h-5 w-5 shrink-0 rounded border ${
            todo.done ? "bg-gray-900" : "bg-white"
          }`}
        />
        <div className="min-w-0">
          <div
            className={`truncate text-sm ${
              todo.done ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {todo.title}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
            <span>{new Date(todo.createdAt).toLocaleString()}</span>
            <span>更新: {new Date(todo.updatedAt).toLocaleString()}</span>
            {error && <span className="text-red-600">{error}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={toggleDone}
          disabled={loading === "toggle"}
          className="rounded-lg border px-2.5 py-1 text-xs disabled:opacity-50"
        >
          {todo.done ? "未完了" : "完了"}
        </button>
        <button
          onClick={remove}
          disabled={loading === "delete"}
          className="rounded-lg border px-2.5 py-1 text-xs text-red-600 disabled:opacity-50"
        >
          削除
        </button>
      </div>
    </li>
  );
}
