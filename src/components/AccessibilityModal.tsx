"use client";

import { useAccessibility, ThemeMode, TextSize } from "@/context/AccessibilityContext";
import {
  Sun,
  Moon,
  Eye,
  Type,
  Brain,
  ZapOff,
  Compass,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function AccessibilityModal() {
  const {
    theme,
    setTheme,
    adhdMode,
    toggleAdhdMode,
    dyslexicFont,
    toggleDyslexicFont,
    textSize,
    setTextSize,
    reduceMotion,
    toggleReduceMotion,
    readingGuide,
    toggleReadingGuide,
    isSpeaking,
    stopSpeaking,
    isModalOpen,
    setIsModalOpen,
  } = useAccessibility();

  if (!isModalOpen) return null;

  const resetAll = () => {
    setTheme("light");
    if (adhdMode) toggleAdhdMode();
    if (dyslexicFont) toggleDyslexicFont();
    setTextSize("normal");
    if (reduceMotion) toggleReduceMotion();
    if (readingGuide) toggleReadingGuide();
    stopSpeaking();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="a11y-modal-title" className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                Central de Acessibilidade
              </h2>
              <p className="text-xs text-zinc-500">
                Ajuste a interface para o seu conforto visual e cognitivo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            aria-label="Fechar modal de acessibilidade"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. SELEÇÃO DE TEMA & ALTO CONTRASTE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            1. Tema &amp; Contraste
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 text-xs font-bold transition ${
                theme === "light"
                  ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span>Claro</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 text-xs font-bold transition ${
                theme === "dark"
                  ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <span>Escuro</span>
            </button>

            <button
              onClick={() => setTheme("high-contrast")}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 text-xs font-bold transition ${
                theme === "high-contrast"
                  ? "border-yellow-400 bg-black text-yellow-300"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
              }`}
            >
              <Eye className="w-5 h-5 text-yellow-400" />
              <span>Alto Contraste</span>
            </button>
          </div>
        </div>

        {/* 2. RECURSOS COGNITIVOS & TDAH */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            2. Foco Cognitivo &amp; TDAH
          </label>

          {/* Toggle Modo TDAH */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Modo Foco TDAH</span>
              </div>
              <p className="text-xs text-zinc-500">
                Remove fundos chamativos, melhora espaçamento de parágrafos e destaca seções ativas.
              </p>
            </div>
            <button
              onClick={toggleAdhdMode}
              role="switch"
              aria-checked={adhdMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                adhdMode ? "bg-purple-600" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  adhdMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle Guia de Leitura */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Régua Guia de Leitura</span>
              </div>
              <p className="text-xs text-zinc-500">
                Faixa que acompanha o cursor do mouse para não se perder nas linhas de texto.
              </p>
            </div>
            <button
              onClick={toggleReadingGuide}
              role="switch"
              aria-checked={readingGuide}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                readingGuide ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  readingGuide ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3. TIPOGRAFIA & LEGIBILIDADE */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            3. Tipografia &amp; Legibilidade
          </label>

          {/* Tamanho de Fonte */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <span className="text-xs font-semibold px-2 text-zinc-700 dark:text-zinc-300">
              Tamanho do Texto:
            </span>
            <div className="flex items-center gap-1">
              {(["normal", "large", "extra-large"] as TextSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    textSize === size
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>

          {/* Fonte Alta Legibilidade (Dislexia) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <Type className="w-4 h-4 text-blue-500" />
                <span>Fonte de Alta Legibilidade</span>
              </div>
              <p className="text-xs text-zinc-500">
                Aumenta o peso das letras inferiores e o espaçamento para facilitar leitura de disléxicos.
              </p>
            </div>
            <button
              onClick={toggleDyslexicFont}
              role="switch"
              aria-checked={dyslexicFont}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                dyslexicFont ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  dyslexicFont ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Redução de Movimento / Animações */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <ZapOff className="w-4 h-4 text-emerald-500" />
                <span>Reduzir Movimento / Animações</span>
              </div>
              <p className="text-xs text-zinc-500">
                Evita tonturas, náuseas e distrações desligando efeitos de transição visual.
              </p>
            </div>
            <button
              onClick={toggleReduceMotion}
              role="switch"
              aria-checked={reduceMotion}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                reduceMotion ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  reduceMotion ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* CONTROLES DO RODAPÉ */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Redefinir Padrões
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
          >
            Concluir Ajustes
          </button>
        </div>
      </div>
    </div>
  );
}
