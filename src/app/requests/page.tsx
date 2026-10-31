"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMatchesForUser, updateMatchStatus } from "@/lib/services";
import { MatchRequest } from "@/types";
import { Check, X, MessageSquare, User, Calendar, Phone, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function RequestsPage() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getMatchesForUser(currentUser.id);
      setMatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [currentUser]);

  const handleStatusChange = async (matchId: string, status: "accepted" | "rejected") => {
    await updateMatchStatus(matchId, status);
    await loadRequests();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-blue-600" />
            Minhas Conexões para o DevFest
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Visualizando como: <strong className="text-blue-600 dark:text-blue-400">{currentUser?.name}</strong> ({currentUser?.role})
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-bold px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition w-fit"
        >
          &larr; Voltar para o feed do DevFest
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-zinc-500">Carregando conexões...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <MessageSquare className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200">
            Nenhuma mensagem ou convite ainda
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Navegue pelo feed de participantes do DevFest e dê um &ldquo;Bora no DevFest!&rdquo; para quem tem interesses parecidos com você.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const isTarget = match.mentorId === currentUser?.id;

            return (
              <div
                key={match.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        match.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : match.status === "rejected"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {match.status === "accepted"
                        ? "Combinado! 🎉"
                        : match.status === "rejected"
                        ? "Recusado"
                        : "Aguardando Confirmação"}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(match.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Trilha/Tema: {match.interestTopic}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 italic">
                    &ldquo;{match.message}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {isTarget
                          ? `Enviado por: ${match.menteeName}`
                          : `Para: ${match.mentorName}`}
                      </span>
                    </div>

                    {match.menteeContact && (
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contato: {match.menteeContact}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Se a mensagem foi enviada para o usuário logado e ainda está pendente */}
                {isTarget && match.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStatusChange(match.id, "accepted")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      <Check className="w-4 h-4" /> Aceitar Encontro
                    </button>
                    <button
                      onClick={() => handleStatusChange(match.id, "rejected")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition"
                    >
                      <X className="w-4 h-4" /> Agora Não
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
