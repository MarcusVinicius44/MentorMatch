"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "high-contrast";
export type TextSize = "normal" | "large" | "extra-large";

interface AccessibilityContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  // Modo TDAH (Foco simplificado, menos distrações, espaçamento e leitura amigável)
  adhdMode: boolean;
  setAdhdMode: (enabled: boolean) => void;
  toggleAdhdMode: () => void;
  // Fonte amigável para dislexia / legibilidade (OpenDyslexic / sans clean)
  dyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  // Tamanho do texto
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  // Redução de movimento
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  // Linha-guia de leitura (Reading Guide bar para foco)
  readingGuide: boolean;
  toggleReadingGuide: () => void;
  // Leitor de texto por voz (Text-to-Speech)
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  // Modal de acessibilidade
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({} as AccessibilityContextType);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [adhdMode, setAdhdModeState] = useState<boolean>(false);
  const [dyslexicFont, setDyslexicFontState] = useState<boolean>(false);
  const [textSize, setTextSizeState] = useState<TextSize>("normal");
  const [reduceMotion, setReduceMotionState] = useState<boolean>(false);
  const [readingGuide, setReadingGuideState] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mouseY, setMouseY] = useState<number>(0);

  // Carregar preferências salvas do usuário
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("devfest_a11y_theme") as ThemeMode | null;
      if (savedTheme) setThemeState(savedTheme);

      const savedAdhd = localStorage.getItem("devfest_a11y_adhd");
      if (savedAdhd !== null) setAdhdModeState(savedAdhd === "true");

      const savedDyslexic = localStorage.getItem("devfest_a11y_dyslexic");
      if (savedDyslexic !== null) setDyslexicFontState(savedDyslexic === "true");

      const savedSize = localStorage.getItem("devfest_a11y_text_size") as TextSize | null;
      if (savedSize) setTextSizeState(savedSize);

      const savedMotion = localStorage.getItem("devfest_a11y_motion");
      if (savedMotion !== null) setReduceMotionState(savedMotion === "true");
    } catch (e) {
      console.error("Erro ao carregar preferências de acessibilidade:", e);
    }
  }, []);

  // Aplicar classes no elemento HTML raiz <html>
  useEffect(() => {
    const root = document.documentElement;

    // Gerenciar Tema
    root.classList.remove("dark", "high-contrast-theme");
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "high-contrast") {
      root.classList.add("high-contrast-theme");
    }

    // Modo TDAH (Foco e redução de estímulos)
    if (adhdMode) {
      root.classList.add("adhd-mode");
    } else {
      root.classList.remove("adhd-mode");
    }

    // Fonte de Alta Legibilidade
    if (dyslexicFont) {
      root.classList.add("dyslexic-font");
    } else {
      root.classList.remove("dyslexic-font");
    }

    // Tamanho da Fonte
    root.classList.remove("text-size-large", "text-size-xlarge");
    if (textSize === "large") {
      root.classList.add("text-size-large");
    } else if (textSize === "extra-large") {
      root.classList.add("text-size-xlarge");
    }

    // Redução de movimento
    if (reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [theme, adhdMode, dyslexicFont, textSize, reduceMotion]);

  // Listener para linha guia de leitura (modo foco TDAH/leitura)
  useEffect(() => {
    if (!readingGuide) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [readingGuide]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("devfest_a11y_theme", newTheme);
  };

  const setAdhdMode = (enabled: boolean) => {
    setAdhdModeState(enabled);
    localStorage.setItem("devfest_a11y_adhd", String(enabled));
  };

  const toggleAdhdMode = () => setAdhdMode(!adhdMode);

  const toggleDyslexicFont = () => {
    const newVal = !dyslexicFont;
    setDyslexicFontState(newVal);
    localStorage.setItem("devfest_a11y_dyslexic", String(newVal));
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem("devfest_a11y_text_size", size);
  };

  const toggleReduceMotion = () => {
    const newVal = !reduceMotion;
    setReduceMotionState(newVal);
    localStorage.setItem("devfest_a11y_motion", String(newVal));
  };

  const toggleReadingGuide = () => {
    setReadingGuideState((prev) => !prev);
  };

  // Text-to-Speech (Leitura de tela nativa no navegador)
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        setTheme,
        adhdMode,
        setAdhdMode,
        toggleAdhdMode,
        dyslexicFont,
        toggleDyslexicFont,
        textSize,
        setTextSize,
        reduceMotion,
        toggleReduceMotion,
        readingGuide,
        toggleReadingGuide,
        speakText,
        stopSpeaking,
        isSpeaking,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}

      {/* Régua / Linha Guia de Leitura interativa (ótimo para foco TDAH/Dislexia) */}
      {readingGuide && (
        <div
          aria-hidden="true"
          className="fixed left-0 right-0 h-9 pointer-events-none z-9999 bg-amber-400/20 border-y-2 border-amber-500/80 shadow-xs transition-transform duration-75"
          style={{ top: `${mouseY - 18}px` }}
        />
      )}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
