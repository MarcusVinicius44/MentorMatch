"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { rankMatches } from "@/lib/matching";

export default function MatchesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState({ status: "loading", me: null, matches: [] });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    (async () => {
      const mine = await getDoc(doc(db, "profiles", user.uid));
      if (!mine.exists()) {
        setState({ status: "no-profile", me: null, matches: [] });
        return;
      }
      const me = { uid: user.uid, ...mine.data() };
      const all = await getDocs(collection(db, "profiles"));
      const candidates = all.docs.map((d) => ({ uid: d.id, ...d.data() }));
      setState({ status: "ready", me, matches: rankMatches(me, candidates) });
    })().catch((err) => {
      console.error(err);
      setState({ status: "error", me: null, matches: [] });
    });
  }, [user, loading, router]);

  if (state.status === "loading") return <p>Procurando pessoas para você...</p>;
  if (state.status === "error") return <p>Algo deu errado ao carregar os matches.</p>;
  if (state.status === "no-profile") {
    return (
      <p>
        Complete seu{" "}
        <Link href="/profile" className="underline">
          perfil
        </Link>{" "}
        para ver seus matches.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Seus matches</h1>
      {state.matches.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">
          Ainda não há ninguém com assuntos em comum. Volte quando mais gente
          chegar ao evento!
        </p>
      )}
      {state.matches.map((m) => (
        <MatchCard key={m.profile.uid} me={state.me} match={m} user={user} />
      ))}
    </div>
  );
}

function MatchCard({ me, match, user }) {
  const { profile, learn, teach } = match;
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ me, candidate: profile }),
        });
        const data = await res.json();
        if (!res.ok || !data.text) throw new Error(data.error ?? `HTTP ${res.status}`);
        if (!cancelled) setText(data.text);
      } catch (err) {
        // O card continua útil com os assuntos em comum; só avisamos que a IA falhou.
        console.error("Falha ao gerar explicação:", err);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [me, profile, user, attempt]);

  function retry() {
    setBusy(true);
    setFailed(false);
    setAttempt((n) => n + 1);
  }

  return (
    <article className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        {profile.photoURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photoURL} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
        )}
        <div>
          <h2 className="font-semibold">{profile.name}</h2>
          <p className="text-sm text-zinc-500">
            {profile.level === "iniciante" ? "Começando" : "Experiente"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 text-sm">
        {learn.length > 0 && (
          <div>
            <p className="mb-1.5 font-medium text-zinc-700 dark:text-zinc-300">Ensina:</p>
            <div className="flex flex-wrap gap-2">
              {learn.map((t) => (
                <span key={`l-${t}`} className="chip chip-on">{t}</span>
              ))}
            </div>
          </div>
        )}
        {teach.length > 0 && (
          <div>
            <p className="mb-1.5 font-medium text-zinc-700 dark:text-zinc-300">Quer aprender:</p>
            <div className="flex flex-wrap gap-2">
              {teach.map((t) => (
                <span key={`t-${t}`} className="chip">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {failed ? (
        <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
          Não foi possível gerar a explicação agora.{" "}
          <button onClick={retry} className="underline">
            Tentar de novo
          </button>
        </p>
      ) : (
        <p className="mt-3 text-zinc-700 dark:text-zinc-300">
          {busy ? "Gemini está pensando..." : text}
        </p>
      )}
    </article>
  );
}
