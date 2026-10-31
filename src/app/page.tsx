"use client";

import { useEffect, useState } from "react";
import { UserProfile, DevFestEventDate } from "@/types";
import { getAllProfiles, UPCOMING_EVENTS } from "@/lib/services";
import { ProfileCard } from "@/components/ProfileCard";
import { EventSchedule } from "@/components/EventSchedule";
import {
  Search,
  Sparkles,
  Filter,
  Users,
  ShieldCheck,
  HeartHandshake,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"todos" | "mentor" | "iniciante">("todos");
  const [selectedTag, setSelectedTag] = useState<string>("Todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProfiles();
        setProfiles(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tags = ["Todas", "Next.js", "TypeScript", "React", "Cloud", "IA Aplicada", "Arquitetura", "Design Systems"];

  const filtered = profiles.filter((p) => {
    const matchesRole = roleFilter === "todos" || p.role === roleFilter;

    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.devfestGoals && p.devfestGoals.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.cityOrState && p.cityOrState.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.interests.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag =
      selectedTag === "Todas" ||
      p.interests.some((s) => s.toLowerCase() === selectedTag.toLowerCase());

    return matchesRole && matchesSearch && matchesTag;
  });

  const totalMentores = profiles.filter((p) => p.role === "mentor").length;
  const totalIniciantes = profiles.filter((p) => p.role === "iniciante").length;

  return (
    <div className="space-y-10">
      {/* Hero Section com o Lema */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-blue-600/10 via-indigo-500/5 to-transparent border border-blue-500/15 p-8 md:p-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
          <HeartHandshake className="w-4 h-4" />
          Comunidade DevFest &bull; Conexão Pré-Evento
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight text-zinc-900 dark:text-white">
          &ldquo;Ninguém precisa ir sozinho ao{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            DevFest
          </span>
          &rdquo;
        </h1>

        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Conecte-se antes mesmo do credenciamento começar! Seja você um <strong>mentor sênior</strong> pronto para orientar ou um <strong>iniciante</strong> dando os primeiros passos no ecossistema <strong>Next.js</strong>, encontre sua dupla ou grupo para o evento.
        </p>

        {/* Resumo de Participantes */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{totalMentores} Mentores Seniores</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{totalIniciantes} Iniciantes no Evento</span>
          </div>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/create-profile"
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
          >
            Criar Meu Mini Perfil do DevFest
          </Link>
          <a
            href="#agenda"
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Ver Datas dos Projetos
          </a>
        </div>
      </div>

      {/* SEÇÃO: DATAS DOS PRÓXIMOS PROJETOS E EVENTOS */}
      <div id="agenda" className="scroll-mt-20">
        <EventSchedule events={UPCOMING_EVENTS} />
      </div>

      {/* Barra de Filtros e Busca de Participantes */}
      <div id="explorar" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Busca por texto */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nome, bio, cidade ou objetivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Abas de Tipo (Todos / Mentores / Iniciantes) */}
          <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-2xl border border-zinc-300/50 dark:border-zinc-700/50">
            <button
              onClick={() => setRoleFilter("todos")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                roleFilter === "todos"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Todos ({profiles.length})
            </button>
            <button
              onClick={() => setRoleFilter("mentor")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                roleFilter === "mentor"
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Mentores ({totalMentores})
            </button>
            <button
              onClick={() => setRoleFilter("iniciante")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                roleFilter === "iniciante"
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Iniciantes ({totalIniciantes})
            </button>
          </div>
        </div>

        {/* Tags de Tecnologias / Trilhas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-zinc-400 shrink-0 ml-1 mr-1" />
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Lista de Cards */}
        {loading ? (
          <div className="text-center py-16 text-zinc-500">
            Carregando participantes do DevFest...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl">
            <Users className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Nenhum participante encontrado com esses filtros.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Que tal criar o seu mini perfil e ser o primeiro da sua trilha?
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((user) => (
              <ProfileCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
