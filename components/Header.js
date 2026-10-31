"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          DevFest Mentor Match
        </Link>
        {user && (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/profile" className="hover:underline">
              Meu perfil
            </Link>
            <Link href="/matches" className="hover:underline">
              Matches
            </Link>
            <button onClick={logout} className="text-zinc-500 hover:underline">
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
