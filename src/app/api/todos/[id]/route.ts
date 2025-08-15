export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// PATCH /api/todos/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } } // ← エイリアスを使わずインラインで
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as unknown;

  type TodoUpdate = { done?: boolean; title?: string };
  const data: TodoUpdate = {};

  if (typeof (body as { done?: unknown }).done === "boolean") {
    data.done = (body as { done: boolean }).done;
  }
  if (typeof (body as { title?: unknown }).title === "string") {
    const t = (body as { title: string }).title.trim();
    if (t) data.title = t;
  }

  if (!("done" in data) && !("title" in data)) {
    return NextResponse.json({ error: "no valid fields" }, { status: 400 });
  }

  const result = await prisma.todo.updateMany({
    where: { id: params.id, userId: session.user.id },
    data,
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.todo.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  return NextResponse.json(updated);
}

// DELETE /api/todos/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } } // ← ここもインラインで
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.todo.deleteMany({
    where: { id: params.id, userId: session.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
