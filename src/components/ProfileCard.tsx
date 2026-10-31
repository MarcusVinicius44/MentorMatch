"use client";

import { useState } from "react";
import { UserProfile, ProjectLink } from "@/types";
import { ConnectModal } from "./ConnectModal";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  MapPin,
  MessageCircle,
  Sparkles,
  Target,
  Globe,
  ExternalLink,
  ShieldCheck,
  Volume2,
  FolderGit2,
  Share2,
  Phone,
} from "lucide-react";

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { speakText } = useAccessibility();
  const isMentor = user.role === "mentor";

  const handleReadProfile = () => {
    const projectsSummary =
      user.projects && user.projects.length > 0
        ? `Projetos: ${user.projects.map((p) => p.title).join(", ")}.`
        : "";

    const textToRead = `${user.name}. ${
      isMentor ? "Mentor Sênior" : "Iniciante"
    }. Cidade: ${user.cityOrState || "Não informada"}. Sobre: ${user.bio}. Objetivo no DevFest: ${
      user.devfestGoals || "Fazer networking"
    }. Áreas de interesse: ${user.interests.join(", ")}. ${projectsSummary}`;

    speakText(textToRead);
  };

  return (
    <>
      <article
        aria-label={`Perfil de ${user.name}, ${isMentor ? "Mentor" : "Iniciante"}`}
        className="flex flex-col justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition relative overflow-hidden group"
      >
        {/* Faixa decorativa no topo */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isMentor
              ? "bg-linear-to-r from-blue-600 to-indigo-600"
              : "bg-linear-to-r from-emerald-500 to-teal-500"
          }`}
        />

        <div>
          {/* Header do Card com Imagem / Avatar */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Foto de Perfil / Avatar */}
              <div className="relative">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`Foto de ${user.name}`}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-xs"
                  />
                ) : (
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-xs ${
                      isMentor
                        ? "bg-linear-to-br from-blue-600 to-indigo-700"
                        : "bg-linear-to-br from-emerald-600 to-teal-700"
                    }`}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {/* Badge do papel */}
                <span
                  title={isMentor ? "Mentor Senior" : "Iniciante"}
                  className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-zinc-900 shadow-xs"
                >
                  {isMentor ? (
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 leading-tight">
                    {user.name}
                  </h3>

                  {/* Leitor Text-to-Speech */}
                  <button
                    onClick={handleReadProfile}
                    title={`Ouvir descrição de ${user.name}`}
                    aria-label={`Ouvir perfil de ${user.name}`}
                    className="p-1 rounded-md text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      isMentor
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                    }`}
                  >
                    {user.seniority}
                  </span>

                  {user.cityOrState && (
                    <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      {user.cityOrState}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="flex items-center gap-1">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`GitHub de ${user.name}`}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`LinkedIn de ${user.name}`}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Portfólio / Site de ${user.name}`}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Mini Bio */}
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 line-clamp-3">
            {user.bio}
          </p>

          {/* Objetivo no DevFest */}
          {user.devfestGoals && (
            <div className="mb-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1">
                <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Objetivo no DevFest:</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                &ldquo;{user.devfestGoals}&rdquo;
              </p>
            </div>
          )}

          {/* Links de Projetos */}
          {user.projects && user.projects.length > 0 && (
            <div className="mb-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Projetos &amp; Portfólio:</span>
              </div>
              <div className="space-y-1">
                {user.projects.map((proj, idx) => (
                  <a
                    key={idx}
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-blue-500 transition group/proj"
                  >
                    <div className="truncate mr-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover/proj:text-blue-600 dark:group-hover/proj:text-blue-400">
                        {proj.title}
                      </span>
                      {proj.description && (
                        <p className="text-[11px] text-zinc-500 truncate">{proj.description}</p>
                      )}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags / Trilhas de Interesse */}
          <div className="flex flex-wrap gap-1.5 mb-5" aria-label="Interesses">
            {user.interests.map((tech) => (
              <span
                key={tech}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                #{tech}
              </span>
            ))}
          </div>
        </div>

        {/* Rodapé e Botão de Ação */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">
            {isMentor ? "Disponível para orientar" : "Buscando companhia/mentoria"}
          </span>

          <button
            onClick={() => setModalOpen(true)}
            aria-label={`Conectar com ${user.name} para o DevFest`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-xs transition ${
              isMentor
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Bora no DevFest!
          </button>
        </div>
      </article>

      <ConnectModal
        targetUser={user}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
