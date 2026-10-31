"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import LoginButton from "@/components/LoginButton";
import { IconCoffee, IconLock, IconSparkles } from "@/components/icons";

const STEPS = [
  {
    n: "1",
    title: "Conte sobre você",
    text: "Escolha o que quer aprender e o que pode ensinar. Leva cerca de 1 minuto.",
  },
  {
    n: "2",
    title: "Veja quem combina",
    text: "Mostramos as pessoas do evento com interesses complementares aos seus, e a IA explica o porquê.",
  },
  {
    n: "3",
    title: "Marque um café",
    text: "Mande um convite, converse pelo próprio app e combinem horário e lugar.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Quem já entrou vai direto para a próxima etapa útil.
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "profiles", user.uid))
      .then((snap) => router.replace(snap.exists() ? "/matches" : "/profile"))
      .catch(() => router.replace("/profile"));
  }, [user, router]);

  if (loading || user) {
    return (
      <div className="flex flex-col gap-4 py-16" aria-busy="true">
        <div className="skeleton h-10 w-2/3" />
        <div className="skeleton h-5 w-1/2" />
        <div className="skeleton h-12 w-48" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16">
      <section className="hero-glow -mx-4 rounded-3xl px-4 py-12 md:px-10 md:py-16">
        <span className="badge bg-primary-soft text-primary">Para quem vai ao DevFest</span>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Ninguém precisa ir sozinho ao DevFest.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Encontre alguém do evento para um café de 15 minutos: quem está começando conhece quem já
          está no caminho, e vice-versa.
        </p>
        <LoginButton className="mt-8" />
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <IconLock width={16} height={16} />
          Você entra com sua conta Google. Só participantes logados veem seu perfil.
        </p>
      </section>

      <section aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="text-2xl font-bold">
          Como funciona
        </h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="card">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft font-bold text-primary">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="exemplo" className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 id="exemplo" className="text-2xl font-bold">
            Veja como é um match
          </h2>
          <p className="mt-2 text-muted">
            Você vê o que cada pessoa pode te ensinar e o que ela quer aprender com você. A IA
            resume por que vocês combinam e sugere um assunto para o café.
          </p>
        </div>
        <ExampleCard />
      </section>

      <section className="card flex flex-col items-start gap-4 !bg-primary-soft md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <IconCoffee className="text-primary" width={28} height={28} />
          <p className="text-lg font-semibold">Pronto para conhecer alguém novo?</p>
        </div>
        <LoginButton />
      </section>
    </div>
  );
}

function ExampleCard() {
  return (
    <div className="card" aria-label="Exemplo de match">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#34a853] font-semibold text-white">
            AL
          </span>
          <div>
            <p className="font-semibold">Ana Lima</p>
            <p className="text-sm text-muted">Tem experiência</p>
          </div>
        </div>
        <span className="badge bg-success-soft text-success">Match forte</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="badge bg-success-soft text-success">Pode te ensinar: 🦋 Flutter</span>
        <span className="badge bg-success-soft text-success">Pode te ensinar: 🔥 Firebase</span>
        <span className="badge bg-primary-soft text-primary">Quer aprender: 🌐 Web</span>
      </div>
      <div className="mt-4 rounded-xl bg-surface-2 p-3 text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <IconSparkles width={16} height={16} className="text-primary" />
          Por que vocês combinam
        </p>
        <p className="mt-1 text-muted">
          Você quer aprender Flutter e a Ana domina o assunto. Em troca, você pode mostrar a ela os
          primeiros passos em Web. Que tal conversar sobre publicar seu primeiro app?
        </p>
      </div>
      <p className="mt-3 text-xs text-muted">Exemplo ilustrativo.</p>
    </div>
  );
}
