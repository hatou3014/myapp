import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/todos/:id
export async function PATCH(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const updated = await prisma.todo.update({
    where: { id },
    data: { done: true },
  });
  return NextResponse.json(updated);
}

// DELETE /api/todos/:id
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
