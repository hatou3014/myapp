// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const runtime = "nodejs"; // これは残してOK
export const dynamic = "force-dynamic"; // ←これを追加！

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Hello, {session.user?.name ?? session.user?.email}</p>
    </main>
  );
}
