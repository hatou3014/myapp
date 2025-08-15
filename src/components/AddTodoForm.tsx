"use client";
import React, { useOptimistic, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";

export default function AddTodoForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimisticTodos, addOptimistic] = useOptimistic<string[], string>(
    [],
    (state, newTitle) => [newTitle, ...state]
  );

async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const title = inputRef.current?.value?.trim();
  if (!title) return;

  setError(null);
  setSubmitting(true);

  startTransition(() => {
    addOptimistic(title);
  });

  try {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || `Failed: ${res.status}`);
    }
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("不明なエラーが発生しました");
    }
  } finally {
    setSubmitting(false);
  }
}


  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="やることを入力…"
          className="flex-1 rounded-xl border px-3 py-2 outline-none ring-0 focus:border-gray-400"
          aria-label="新規Todo"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl border bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "追加中…" : "追加"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {optimisticTodos.length > 0 && (
        <div className="mt-3 space-y-1 text-xs text-gray-500">
          {optimisticTodos.map((t, i) => (
            <div key={`${t}-${i}`}>追加予定: {t}</div>
          ))}
        </div>
      )}
    </div>
  );
}
