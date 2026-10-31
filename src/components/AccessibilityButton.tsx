"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { Eye, Sun, Moon, Brain, Volume2, VolumeX } from "lucide-react";

export function AccessibilityButton() {
  const { theme, setTheme, adhdMode, toggleAdhdMode, isSpeaking, stopSpeaking, setIsModalOpen } =
    useAccessibility();

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Botão de parar fala caso esteja lendo em voz alta */}
      {isSpeaking && (
        <button
          onClick={stopSpeaking}
          title="Parar leitura em voz alta"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg animate-pulse"
        >
          <VolumeX className="w-4 h-4" />
          <span>Parar Áudio</span>
        </button>
      )}

      <div className="flex items-center gap-1.5 bg-white/95 dark:bg-zinc-900/95 border-2 border-zinc-200 dark:border-zinc-700 p-1.5 rounded-full shadow-2xl backdrop-blur-md">
        {/* Alternância Rápida TDAH */}
        <button
          onClick={toggleAdhdMode}
          title={adhdMode ? "Desativar Modo TDAH" : "Ativar Modo Foco TDAH"}
          aria-label="Ativar ou desativar Modo TDAH"
          className={`p-2 rounded-full transition ${
            adhdMode
              ? "bg-purple-600 text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <Brain className="w-4 h-4" />
        </button>

        {/* Alternância Rápida de Tema */}
        <button
          onClick={() => {
            if (theme === "light") setTheme("dark");
            else if (theme === "dark") setTheme("high-contrast");
            else setTheme("light");
          }}
          title={`Tema Atual: ${theme}. Clique para alternar`}
          aria-label="Alternar tema de cor"
          className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          {theme === "high-contrast" ? (
            <Eye className="w-4 h-4 text-yellow-500" />
          ) : theme === "dark" ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Botão Principal da Central de Acessibilidade */}
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="Abrir Painel Completo de Acessibilidade"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Acessibilidade</span>
        </button>
      </div>
    </div>
  );
}
