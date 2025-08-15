"use client";
import { signIn } from "next-auth/react";

export default function SignInButton({ provider = "github" }: { provider?: string }) {
  return (
    <button
      onClick={() => signIn(provider)}
      className="rounded-xl border bg-white px-3 py-1.5 text-sm shadow-sm"
    >
      Sign in with {provider[0].toUpperCase() + provider.slice(1)}
    </button>
  );
}
