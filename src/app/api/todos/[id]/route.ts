import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const updated = await prisma.todo.update({
    where: { id: params.id },
    data: { done: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.todo.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}