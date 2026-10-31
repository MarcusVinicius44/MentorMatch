"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserProfile } from "@/lib/services";
import { useAuth } from "@/context/AuthContext";
import { UserProfile, UserRole, ProjectLink } from "@/types";
import { ExperienceMiniGame, MiniGameResult } from "@/components/ExperienceMiniGame";
import {
  HeartHandshake,
  Check,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  Plus,
  Trash2,
  FolderGit2,
  Globe,
  Share2,
  Gamepad2,
  RotateCcw,
} from "lucide-react";

export default function CreateProfilePage() {
  const router = useRouter();
  const { setCurrentUser } = useAuth();

  // Estado para controlar se o usuário está na etapa do Minigame ou do Formulário
  const [showGame, setShowGame] = useState(true);
  const [playedGame, setPlayedGame] = useState(false);

  const [role, setRole] = useState<UserRole>("iniciante");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seniority, setSeniority] = useState<UserProfile["seniority"]>("Iniciante");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [cityOrState, setCityOrState] = useState("");
  const [interestsInput, setInterestsInput] = useState("Next.js, TypeScript, React");
  const [devfestGoals, setDevfestGoals] = useState("");
  const [bio, setBio] = useState("");

  // Redes sociais
  const [whatsappOrTelegram, setWhatsappOrTelegram] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Projetos dinâmicos
  const [projects, setProjects] = useState<ProjectLink[]>([
    { title: "", url: "", description: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Callback ao concluir o minigame
  const handleGameComplete = (result: MiniGameResult) => {
    setRole(result.suggestedRole);
    setSeniority(result.suggestedSeniority);
    setInterestsInput(result.selectedStacks.join(", "));

    if (result.suggestedRole === "mentor") {
      setDevfestGoals(
        "Ajudar iniciantes a navegar pelo DevFest, tirar dúvidas de arquitetura e trocar ideias sobre Next.js e " +
          result.selectedStacks.slice(0, 2).join(", ")
      );
    } else {
      setDevfestGoals(
        "Fazer networking, aprender sobre " +
          result.selectedStacks.slice(0, 2).join(", ") +
          " e encontrar mentores para não ir sozinho ao evento"
      );
    }

    setPlayedGame(true);
    setShowGame(false);
  };

  const handleRoleToggle = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "mentor") {
      setSeniority("Senior");
      if (!devfestGoals) {
        setDevfestGoals("Quero ajudar iniciantes a navegar no evento, tirar dúvidas de carreira e Next.js");
      }
    } else {
      setSeniority("Iniciante");
      if (!devfestGoals) {
        setDevfestGoals("Quero fazer networking, assistir às palestras e não ficar sozinho no evento");
      }
    }
  };

  const addProjectField = () => {
    setProjects([...projects, { title: "", url: "", description: "" }]);
  };

  const removeProjectField = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProjectField = (index: number, field: keyof ProjectLink, val: string) => {
    const updated = [...projects];
    updated[index][field] = val;
    setProjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !bio || !devfestGoals) return;

    setIsSubmitting(true);
    try {
      const interests = interestsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const validProjects = projects.filter((p) => p.title.trim() && p.url.trim());

      const profile: UserProfile = {
        id: "user-" + Date.now(),
        name,
        email,
        role,
        seniority,
        bio,
        avatarUrl: avatarUrl.trim() || undefined,
        interests,
        devfestGoals,
        cityOrState: cityOrState.trim() || undefined,
        whatsappOrTelegram: whatsappOrTelegram.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        twitterUrl: twitterUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        projects: validProjects.length > 0 ? validProjects : undefined,
        createdAt: Date.now(),
      };

      await saveUserProfile(profile);
      setCurrentUser(profile);
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* SE O MINIGAME ESTIVER ATIVO */}
      {showGame ? (
        <ExperienceMiniGame
          onComplete={handleGameComplete}
          onSkip={() => setShowGame(false)}
        />
      ) : (
        /* FORMULÁRIO DO PERFIL APÓS O JOGO (OU CASO PULE) */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <HeartHandshake className="w-4 h-4" /> &ldquo;Ninguém precisa ir sozinho ao DevFest&rdquo;
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Seu Mini Perfil do DevFest
              </h1>
            </div>

            {/* Botão de refazer minigame se já jogou ou quer jogar agora */}
            <button
              type="button"
              onClick={() => setShowGame(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition w-fit"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              {playedGame ? "Refazer Minigame" : "Jogar Minigame de Nível"}
            </button>
          </div>

          {playedGame && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  O minigame definiu suas preferências: <strong>{role === "mentor" ? "Mentor Senior" : "Iniciante"} ({seniority})</strong>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">Ajustável abaixo</span>
            </div>
          )}

          {/* Seletor de Papel no Evento */}
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-2">
              Confirmar seu Papel no DevFest:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleToggle("iniciante")}
                className={`p-4 rounded-2xl border-2 text-left transition flex flex-col gap-1 ${
                  role === "iniciante"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  Iniciante / Junior
                </div>
                <p className="text-xs text-zinc-500">
                  Estou começando e quero companhia e mentoria no evento.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleToggle("mentor")}
                className={`p-4 rounded-2xl border-2 text-left transition flex flex-col gap-1 ${
                  role === "mentor"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-blue-700 dark:text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                  Mentor Senior
                </div>
                <p className="text-xs text-zinc-500">
                  Tenho bagagem e quero orientar e acolher quem está começando.
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FOTO DE PERFIL / AVATAR */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <label className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-200">
                  Foto de Perfil ou Avatar
                </label>
              </div>
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Pré-visualização"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-500 shrink-0">
                    Sem foto
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://exemplo.com/minha-foto.jpg ou URL do GitHub"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Dica: cole a URL do seu GitHub (`https://github.com/seunome.png`) ou foto online.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                  Nome ou Como quer ser chamado
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Clara Ribeiro"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: clara@exemplo.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                  Senioridade Atual
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value as UserProfile["seniority"])}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  {role === "mentor" ? (
                    <>
                      <option value="Senior">Senior</option>
                      <option value="Especialista">Especialista / Lead / Staff</option>
                      <option value="Pleno">Pleno Experiente</option>
                    </>
                  ) : (
                    <>
                      <option value="Iniciante">Iniciante / Estudante</option>
                      <option value="Junior">Desenvolvedor(a) Júnior</option>
                      <option value="Pleno">Transição de Carreira</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                  Cidade / Região
                </label>
                <input
                  type="text"
                  value={cityOrState}
                  onChange={(e) => setCityOrState(e.target.value)}
                  placeholder="Ex: São Paulo - SP ou Campinas"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                Trilhas &amp; Stacks de Interesse no Evento
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="Next.js, TypeScript, Cloud, IA Generativa, Mobile"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                Seu Objetivo no DevFest
              </label>
              <input
                type="text"
                required
                value={devfestGoals}
                onChange={(e) => setDevfestGoals(e.target.value)}
                placeholder="Ex: Não ir sozinho, entender Next.js App Router e conhecer mentores na área de Frontend"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300 mb-1">
                Mini Bio (Conte um pouco sobre você)
              </label>
              <textarea
                required
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: Sou estudante autodidata, construindo projetos com Next.js. Adoro trocar ideia sobre tecnologias web e quero muito aproveitar o DevFest..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            {/* REDES SOCIAIS */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <label className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-200">
                  Redes Sociais &amp; Contato
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                    WhatsApp ou Telegram
                  </label>
                  <input
                    type="text"
                    value={whatsappOrTelegram}
                    onChange={(e) => setWhatsappOrTelegram(e.target.value)}
                    placeholder="Ex: (11) 99999-9999 ou @telegram"
                    className="w-full px-3 py-1.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-1.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-1.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                    Portfólio ou Site Pessoal
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://meusite.dev"
                    className="w-full px-3 py-1.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* LINKS DE PROJETOS */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <label className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-200">
                    Link de Projetos &amp; Portfólio
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addProjectField}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Projeto
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-2 relative"
                  >
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProjectField(idx)}
                        className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-rose-500"
                        title="Remover projeto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-6">
                      <input
                        type="text"
                        placeholder="Nome do Projeto (Ex: SaaS Next.js)"
                        value={proj.title}
                        onChange={(e) => updateProjectField(idx, "title", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 outline-hidden"
                      />
                      <input
                        type="url"
                        placeholder="URL do Projeto ou Repo GitHub"
                        value={proj.url}
                        onChange={(e) => updateProjectField(idx, "url", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 outline-hidden"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Breve descrição do projeto (opcional)"
                      value={proj.description || ""}
                      onChange={(e) => updateProjectField(idx, "description", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 outline-hidden"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? "Publicando Perfil..." : "Publicar Mini Perfil no DevFest"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
