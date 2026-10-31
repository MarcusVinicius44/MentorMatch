"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import Avatar from "@/components/Avatar";
import { otherSide, sendMessage, watchMessages } from "@/lib/invites";

const QUICK_REPLIES = [
  "Oi! Que bom conhecer você 😊",
  "Podemos nos encontrar no próximo intervalo?",
  "Onde fica bom para você?",
];

export default function ChatRoom() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [invite, setInvite] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | blocked
  const [contact, setContact] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    let unsubscribe = () => {};
    (async () => {
      try {
        const snap = await getDoc(doc(db, "invites", id));
        const data = snap.exists() ? { id: snap.id, ...snap.data() } : null;
        if (!data || data.status !== "accepted") {
          setState("blocked");
          return;
        }
        setInvite(data);
        setState("ready");
        const other = otherSide(data, user.uid);
        getDoc(doc(db, "profiles", other.uid, "private", "contact"))
          .then((c) => c.exists() && setContact(c.data().value ?? ""))
          .catch(() => {});
        unsubscribe = watchMessages(id, setMessages, (err) => {
          console.error(err);
          setError("Não foi possível carregar as mensagens.");
        });
      } catch (err) {
        console.error(err);
        setState("blocked");
      }
    })();
    return () => unsubscribe();
  }, [id, user, loading, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function submit(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText("");
    setError("");
    try {
      await sendMessage(id, user.uid, value);
    } catch (err) {
      console.error(err);
      setText(value);
      setError("Não foi possível enviar. Tente de novo.");
    }
  }

  if (state === "loading" || !user) {
    return <div className="skeleton h-[60vh] w-full" aria-busy="true" />;
  }
  if (state === "blocked") {
    return (
      <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 py-12 text-center">
        <span className="text-5xl" aria-hidden="true">
          🔒
        </span>
        <h1 className="text-xl font-bold">Conversa indisponível</h1>
        <p className="text-muted">
          Ela só abre depois que o convite é aceito, e apenas para os dois participantes.
        </p>
        <Link href="/invites" className="btn-primary mt-2">
          Voltar aos convites
        </Link>
      </div>
    );
  }

  const other = otherSide(invite, user.uid);

  return (
    <div className="mx-auto flex h-[calc(100dvh-11rem)] min-h-96 max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface md:h-[70vh]">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link href="/invites" aria-label="Voltar aos convites" className="btn-ghost !px-2 !py-1.5">
          ←
        </Link>
        <Avatar name={other.name} src={other.photoURL} size={40} />
        <div className="min-w-0">
          <h1 className="truncate font-semibold leading-tight">{other.name}</h1>
          <p className="truncate text-xs text-muted">
            {contact ? `Contato: ${contact}` : "Combinem horário e lugar do café"}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4" aria-live="polite">
        <p className="mx-auto max-w-sm rounded-xl bg-surface-2 px-3 py-2 text-center text-sm text-muted">
          “{invite.message}”
          <span className="block text-xs">— {invite.fromName}</span>
        </p>
        {messages.map((m) => {
          const mine = m.senderUid === user.uid;
          return (
            <div key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
              <p
                className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 ${
                  mine ? "rounded-br-md bg-primary text-primary-fg" : "rounded-bl-md bg-surface-2"
                }`}
              >
                {m.text}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-3">
        {messages.length === 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {QUICK_REPLIES.map((q) => (
              <button key={q} type="button" onClick={() => setText(q)} className="chip !py-1 text-xs">
                {q}
              </button>
            ))}
          </div>
        )}
        {error && (
          <p role="alert" className="pb-2 text-sm text-danger">
            {error}
          </p>
        )}
        <form onSubmit={submit} className="flex gap-2">
          <input
            className="input"
            value={text}
            maxLength={500}
            aria-label="Mensagem"
            placeholder="Escreva uma mensagem..."
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn-primary" disabled={!text.trim()}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
