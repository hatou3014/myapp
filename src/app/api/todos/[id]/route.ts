export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

// PATCH /api/todos/:id
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { done, title } = await req.json().catch(() => ({}));
  const data: Record<string, any> = {};
  if (typeof done === "boolean") data.done = done;
  if (typeof title === "string" && title.trim()) data.title = title.trim();
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "no valid fields" }, { status: 400 });
  }

  // 重要：update() は一意キー必須で AND 条件が使えないため、updateMany で所有者も条件に含める
  const result = await prisma.todo.updateMany({
    where: { id: params.id, userId: session.user.id },
    data,
  });

  if (result.count === 0) {
    // 他人のTodo or 存在しない
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 更新後の値が必要なら取り直す（1回の往復で十分なら省略可）
  const updated = await prisma.todo.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  return NextResponse.json(updated);
}

// DELETE /api/todos/:id
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 所有者条件付きで削除
  const result = await prisma.todo.deleteMany({
    where: { id: params.id, userId: session.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
