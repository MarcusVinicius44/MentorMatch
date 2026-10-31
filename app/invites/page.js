"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Avatar from "@/components/Avatar";
import InviteAction from "@/components/InviteAction";
import { otherSide, watchMyInvites } from "@/lib/invites";

export default function InvitesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [invites, setInvites] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    return watchMyInvites(user.uid, setInvites, (err) => {
      console.error(err);
      setError(true);
    });
  }, [user, loading, router]);

  if (error) {
    return (
      <div className="card mx-auto max-w-lg py-10 text-center">
        <p className="font-semibold">Não foi possível carregar seus convites.</p>
        <p className="mt-1 text-muted">Verifique sua conexão e recarregue a página.</p>
      </div>
    );
  }
  if (!user || invites === null) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-28 w-full" />
      </div>
    );
  }

  const me = { uid: user.uid, name: user.displayName ?? "", photoURL: user.photoURL ?? "" };
  const received = invites.filter((i) => i.to === user.uid && i.status === "pending");
  const chats = invites.filter((i) => i.status === "accepted");
  const sent = invites.filter((i) => i.from === user.uid && i.status !== "accepted");

  if (invites.length === 0) {
    return (
      <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 py-12 text-center">
        <span className="text-5xl" aria-hidden="true">
          ☕
        </span>
        <h1 className="text-xl font-bold">Nenhum convite ainda</h1>
        <p className="text-muted">
          Veja quem combina com você e convide alguém para um café. Os convites enviados e
          recebidos aparecem aqui.
        </p>
        <Link href="/matches" className="btn-primary mt-2">
          Ver meus matches
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Convites e conversas</h1>
      <Section
        title="Esperando sua resposta"
        items={received}
        me={me}
        emptyText="Nenhum convite pendente."
        highlight
      />
      <Section
        title="Conversas"
        items={chats}
        me={me}
        emptyText="Quando um convite for aceito, a conversa aparece aqui."
      />
      <Section title="Enviados por você" items={sent} me={me} emptyText="Nada por aqui." />
    </div>
  );
}

function Section({ title, items, me, emptyText, highlight = false }) {
  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <h2 className="flex items-center gap-2 text-lg font-bold">
        {title}
        {items.length > 0 && (
          <span
            className={`badge ${highlight ? "bg-danger text-white" : "bg-surface-2 text-muted"}`}
          >
            {items.length}
          </span>
        )}
      </h2>
      {items.length === 0 && <p className="text-sm text-muted">{emptyText}</p>}
      {items.map((invite) => {
        const other = otherSide(invite, me.uid);
        return (
          <article key={invite.id} className="card">
            <div className="flex items-center gap-3">
              <Avatar name={other.name} src={other.photoURL} />
              <h3 className="font-semibold">{other.name}</h3>
            </div>
            <p className="mt-3 rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm">“{invite.message}”</p>
            <InviteAction me={me} other={other} invite={invite} />
          </article>
        );
      })}
    </section>
  );
}
