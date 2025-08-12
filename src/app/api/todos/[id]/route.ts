import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function PATCH(_: Request, { params }: Ctx) {
  const updated = await prisma.todo.update({
    where: { id: params.id },
    data: { done: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Ctx) {
  await prisma.todo.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
