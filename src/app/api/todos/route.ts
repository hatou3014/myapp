// 必ずNode実行（Prisma用）
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos); // ← 配列で返す
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();
  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: { title: title.trim(), userId: session.user.id }, // ★ 作成者を紐付け
  });

  // 既存クライアントに合わせてオブジェクトを直接返す
  return NextResponse.json(todo, { status: 201 });
}
