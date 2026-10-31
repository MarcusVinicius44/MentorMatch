"use client";

import { useState } from "react";
import Link from "next/link";
import { IconCoffee } from "@/components/icons";
import { DEFAULT_MESSAGE, respondInvite, sendInvite } from "@/lib/invites";

// Mostra a ação certa conforme o estado do convite entre `me` e `other`.
export default function InviteAction({ me, other, invite }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      console.error(err);
      setError("Não foi possível concluir. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  const wrap = "mt-4 border-t border-border pt-4";

  if (!invite) {
    if (!open) {
      return (
        <div className={wrap}>
          <button onClick={() => setOpen(true)} className="btn-primary w-full sm:w-auto">
            <IconCoffee width={18} height={18} />
            Convidar para um café
          </button>
        </div>
      );
    }
    return (
      <div className={`${wrap} flex flex-col gap-2`}>
        <label className="text-sm font-medium" htmlFor={`msg-${other.uid}`}>
          Mensagem para {other.name?.split(" ")[0]} <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id={`msg-${other.uid}`}
          className="input min-h-20"
          maxLength={200}
          placeholder={DEFAULT_MESSAGE}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={() => run(() => sendInvite(me, other, message))}
            className="btn-primary"
          >
            {busy ? "Enviando..." : "Enviar convite"}
          </button>
          <button onClick={() => setOpen(false)} className="btn-ghost">
            Cancelar
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }

  const sentByMe = invite.from === me.uid;

  if (invite.status === "accepted") {
    return (
      <div className={`${wrap} flex flex-wrap items-center gap-3`}>
        <Link href={`/chat/${invite.id}`} className="btn-primary">
          Abrir conversa
        </Link>
        <span className="badge bg-success-soft text-success">Convite aceito</span>
      </div>
    );
  }
  if (invite.status === "declined") {
    return (
      <p className={`${wrap} text-sm text-muted`}>
        {sentByMe ? "Este convite foi recusado." : "Você recusou este convite."}
      </p>
    );
  }
  if (sentByMe) {
    return (
      <p className={`${wrap} flex items-center gap-2 text-sm text-muted`}>
        <span className="badge bg-warn-soft text-warn">Aguardando</span>
        Convite enviado. Avisaremos aqui quando houver resposta.
      </p>
    );
  }
  return (
    <div className={`${wrap} flex flex-col gap-2`}>
      <p className="text-sm font-medium">{other.name?.split(" ")[0]} quer tomar um café com você!</p>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={busy}
          onClick={() => run(() => respondInvite(invite.id, "accepted"))}
          className="btn-primary"
        >
          Aceitar
        </button>
        <button
          disabled={busy}
          onClick={() => run(() => respondInvite(invite.id, "declined"))}
          className="btn-secondary"
        >
          Recusar
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
