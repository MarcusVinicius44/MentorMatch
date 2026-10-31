"use client";

import { useState } from "react";
import { UserProfile } from "@/types";
import { requestMatch } from "@/lib/services";
import { useAuth } from "@/context/AuthContext";
import { X, Send, CheckCircle2, MessageSquare } from "lucide-react";

interface ConnectModalProps {
  targetUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectModal({ targetUser, isOpen, onClose }: ConnectModalProps) {
  const { currentUser } = useAuth();
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState(currentUser?.whatsappOrTelegram || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setIsSubmitting(true);
    try {
      await requestMatch({
        mentorId: targetUser.id,
        mentorName: targetUser.name,
        menteeId: currentUser?.id || "anon",
        menteeName: currentUser?.name || "Participante do DevFest",
        menteeEmail: currentUser?.email || "contato@exemplo.com",
        menteeContact: contact,
        interestTopic: topic || "Assistir palestras e trocar ideia no evento",
        message,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setMessage("");
        setTopic("");
      }, 1800);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar mensagem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl animate-in fade-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Convite Enviado! 🎉
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Você deu o primeiro passo! <strong>{targetUser.name}</strong> poderá ver seu convite na aba de Conexões para combinarem de se encontrar no DevFest.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                &ldquo;Ninguém precisa ir sozinho ao DevFest&rdquo;
              </span>
              <h2 className="text-xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                Puxar conversa com {targetUser.name}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {targetUser.role === "mentor"
                  ? "Mentor(a) disponível para apoiar no evento"
                  : "Iniciante animado(a) para ir ao evento"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                Qual trilha / palestra ou assunto vocês têm em comum?
              </label>
              <input
                type="text"
                placeholder="Ex: Trilha de Next.js, IA, Dúvidas de Carreira, Coffee Break"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                Sua mensagem de aproximação
              </label>
              <textarea
                required
                rows={3}
                placeholder={`Oi ${targetUser.name.split(" ")[0]}! Também vou ao DevFest e vi que você curte Next.js. Bora nos encontrar por lá para assistir às palestras ou tomar um café?`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                Seu WhatsApp / Telegram (para facilitar no dia do evento)
              </label>
              <input
                type="text"
                placeholder="Ex: (11) 99999-9999 ou @seutelegram"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Enviando..." : "Bora Conectar!"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
