"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Users, UserPlus, MessageCircle, HeartHandshake, Sparkles } from "lucide-react";

export function Navbar() {
  const { currentUser, switchDemoUser } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-black text-lg sm:text-xl tracking-tight">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </span>
          <span className="text-zinc-900 dark:text-zinc-50">
            DevFest <span className="text-blue-600 dark:text-blue-400">Match</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <Users className="w-4 h-4 text-blue-600" />
            Galera do Evento
          </Link>
          <Link
            href="/requests"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            Conexões
          </Link>
          <Link
            href="/create-profile"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <UserPlus className="w-4 h-4 text-indigo-600" />
            Criar Mini Perfil
          </Link>
        </nav>

        {/* Alternador de Usuário Demo */}
        <div className="hidden lg:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs">
          <span className="text-zinc-500">Logado:</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[100px]">
            {currentUser?.name}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase text-[10px]">
            {currentUser?.role}
          </span>
          <button
            onClick={() =>
              switchDemoUser(currentUser?.role === "mentor" ? "iniciante" : "mentor")
            }
            className="text-[11px] underline text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 ml-1 font-medium"
          >
            Trocar
          </button>
        </div>
      </div>
    </header>
  );
}
