import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ← これでOK
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <a className="px-4 py-2 rounded-xl border shadow-sm" href="/api/auth/signout">
          Sign out
        </a>
      </header>

      <p>ようこそ、{session.user?.name ?? session.user?.email} さん</p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Session dump (debug)</h2>
        <pre className="bg-black text-white p-3 rounded-lg overflow-x-auto text-sm">
{JSON.stringify(session, null, 2)}
        </pre>
      </section>
    </main>
  );
}
