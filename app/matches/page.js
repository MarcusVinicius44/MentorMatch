"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import Avatar from "@/components/Avatar";
import InviteAction from "@/components/InviteAction";
import { IconLink, IconSparkles } from "@/components/icons";
import { matchStrength, rankMatches, TOPIC_ICONS } from "@/lib/matching";
import { otherSide, watchMyInvites } from "@/lib/invites";

const FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "experiente", label: "Experientes" },
  { value: "iniciante", label: "Começando" },
];

export default function MatchesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState({ status: "loading", me: null, matches: [] });
  const [filter, setFilter] = useState("todos");
  // Convites indexados pelo uid da outra pessoa, atualizados em tempo real.
  const [invites, setInvites] = useState({});

  useEffect(() => {
    if (!user) return;
    return watchMyInvites(
      user.uid,
      (list) => setInvites(Object.fromEntries(list.map((i) => [otherSide(i, user.uid).uid, i]))),
      (err) => console.error(err),
    );
  }, [user]);

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
      setState({ status: "ready", me, matches: rankMatches(me, candidates), total: candidates.length });
    })().catch((err) => {
      console.error(err);
      setState({ status: "error", me: null, matches: [] });
    });
  }, [user, loading, router]);

  if (state.status === "loading") return <LoadingList />;

  if (state.status === "error") {
    return (
      <EmptyState
        icon="⚠️"
        title="Não conseguimos carregar os matches"
        text="Verifique sua conexão e tente de novo."
        action={
          <button onClick={() => window.location.reload()} className="btn-primary">
            Tentar de novo
          </button>
        }
      />
    );
  }

  if (state.status === "no-profile") {
    return (
      <EmptyState
        icon="👋"
        title="Falta pouco!"
        text="Conte o que você quer aprender e ensinar para ver quem combina com você."
        action={
          <Link href="/profile" className="btn-primary">
            Criar meu perfil
          </Link>
        }
      />
    );
  }

  const visible = state.matches.filter((m) => filter === "todos" || m.profile.level === filter);
  const firstName = (state.me.name ?? "").split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {firstName}! 👋</h1>
        <p className="mt-1 text-muted">
          {state.matches.length > 0
            ? `Encontramos ${state.matches.length} ${
                state.matches.length === 1 ? "pessoa" : "pessoas"
              } com interesses em comum. Convide alguém para um café.`
            : "Ainda não encontramos ninguém com interesses em comum."}
        </p>
      </div>

      {state.matches.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por nível">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={filter === f.value ? "chip chip-on" : "chip"}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {state.matches.length === 0 ? (
        <NoMatches total={state.total} />
      ) : visible.length === 0 ? (
        <p className="text-muted">Ninguém neste filtro por enquanto. Tente outro.</p>
      ) : (
        <div className="grid gap-4">
          {visible.map((m) => (
            <MatchCard
              key={m.profile.uid}
              me={state.me}
              match={m}
              user={user}
              invite={invites[m.profile.uid]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoMatches({ total }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de área de transferência; o usuário ainda pode copiar da barra de endereço.
    }
  }

  return (
    <EmptyState
      icon="🔎"
      title="Ninguém por aqui ainda"
      text={
        total <= 1
          ? "Você é a primeira pessoa no app! Chame quem está no evento para entrar também."
          : "Ninguém tem assuntos em comum com você agora. Adicione mais assuntos ao perfil ou volte quando mais gente chegar."
      }
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={copy} className="btn-primary">
            <IconLink width={18} height={18} />
            {copied ? "Link copiado!" : "Copiar link do app"}
          </button>
          <Link href="/profile" className="btn-secondary">
            Ajustar meu perfil
          </Link>
        </div>
      }
    />
  );
}

function EmptyState({ icon, title, text, action }) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 py-12 text-center">
      <span className="text-5xl" aria-hidden="true">
        {icon}
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-muted">{text}</p>
      <div className="mt-2">{action}</div>
    </div>
  );
}

function LoadingList() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Procurando pessoas para você">
      <div className="skeleton h-8 w-56" />
      <div className="skeleton h-5 w-80 max-w-full" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="card flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="skeleton h-11 w-11 !rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-4 w-40" />
              <div className="skeleton mt-2 h-3 w-24" />
            </div>
          </div>
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

const STRENGTH_STYLE = {
  success: "bg-success-soft text-success",
  primary: "bg-primary-soft text-primary",
  muted: "bg-surface-2 text-muted",
};

function MatchCard({ me, match, user, invite }) {
  const { profile, learn, teach, score } = match;
  const strength = matchStrength(score);
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
    <article className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={profile.name} src={profile.photoURL} />
          <div>
            <h2 className="font-semibold leading-tight">{profile.name}</h2>
            <p className="text-sm text-muted">
              {profile.level === "iniciante" ? "🌱 Está começando" : "🧭 Tem experiência"}
            </p>
          </div>
        </div>
        <span className={`badge shrink-0 ${STRENGTH_STYLE[strength.tone]}`}>{strength.label}</span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {learn.length > 0 && (
          <TagGroup
            label="Pode te ensinar"
            topics={learn}
            style="bg-success-soft text-success"
          />
        )}
        {teach.length > 0 && (
          <TagGroup
            label="Quer aprender com você"
            topics={teach}
            style="bg-primary-soft text-primary"
          />
        )}
      </div>

      <div className="mt-4 rounded-xl bg-surface-2 p-3.5 text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <IconSparkles width={16} height={16} className="text-primary" />
          Por que vocês combinam
        </p>
        {failed ? (
          <p className="mt-1.5 text-warn">
            Não foi possível gerar a explicação agora.{" "}
            <button onClick={retry} className="font-semibold underline">
              Tentar de novo
            </button>
          </p>
        ) : busy ? (
          <div className="mt-2 flex flex-col gap-2" aria-label="A IA está escrevendo">
            <div className="skeleton h-3.5 w-full" />
            <div className="skeleton h-3.5 w-4/5" />
          </div>
        ) : (
          <p className="mt-1.5 text-foreground/90">{text}</p>
        )}
      </div>

      <InviteAction
        me={me}
        other={{ uid: profile.uid, name: profile.name, photoURL: profile.photoURL }}
        invite={invite}
      />
    </article>
  );
}

function TagGroup({ label, topics, style }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {topics.map((t) => (
          <span key={t} className={`badge !px-3 !py-1 text-sm ${style}`}>
            <span aria-hidden="true" className="mr-1">
              {TOPIC_ICONS[t]}
            </span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
