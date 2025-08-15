import React from "react";
import TodoItem from "@/components/TodoItem";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (!todos?.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-gray-500">
        まだTodoがありません。上の入力欄から追加しましょう。
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </ul>
  );
}
