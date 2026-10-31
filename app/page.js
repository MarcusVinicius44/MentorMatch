"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, loading, login } = useAuth();

  return (
    <section className="flex flex-col gap-6 py-10">
      <h1 className="text-4xl font-bold tracking-tight">
        Ninguém precisa ir sozinho ao DevFest.
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Conte o que você quer aprender e o que pode ensinar. A gente encontra
        alguém para um café de 15 minutos e explica por que vocês combinam.
      </p>

      {loading ? null : user ? (
        <div className="flex gap-3">
          <Link href="/profile" className="btn-primary">
            Editar meu perfil
          </Link>
          <Link href="/matches" className="btn-secondary">
            Ver meus matches
          </Link>
        </div>
      ) : (
        <button onClick={login} className="btn-primary w-fit">
          Entrar com Google
        </button>
      )}
    </section>
  );
}
