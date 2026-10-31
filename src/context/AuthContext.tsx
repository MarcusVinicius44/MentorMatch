"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  switchDemoUser: (role: "mentor" | "iniciante") => void;
}

const defaultIniciante: UserProfile = {
  id: "iniciante-1",
  name: "Lucas Mendes",
  email: "lucas.mendes@email.com",
  role: "iniciante",
  seniority: "Iniciante",
  avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
  bio: "Migrando de área, estudando Next.js e JavaScript há 6 meses. É meu primeiro evento de tecnologia e não conheço ninguém ainda!",
  interests: ["Next.js", "React", "Frontend", "Networking"],
  devfestGoals: "Encontrar alguém experiente para tirar dúvidas sobre o mercado e não ficar perdido no primeiro DevFest.",
  cityOrState: "São Paulo - SP",
  githubUrl: "https://github.com/lucas-mendes",
  linkedinUrl: "https://linkedin.com/in/lucas-mendes",
  whatsappOrTelegram: "(11) 98765-4321",
  projects: [
    {
      title: "DevLinks App",
      url: "https://github.com",
      description: "Meu primeiro projeto completo em Next.js com Tailwind CSS.",
    },
  ],
};

const defaultMentor: UserProfile = {
  id: "mentor-1",
  name: "Carlos Silva",
  email: "carlos.silva@tech.com",
  role: "mentor",
  seniority: "Senior",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  bio: "Senior Software Engineer. Já fui a 4 edições do DevFest! Adoro conversar no coffee break, falar de Next.js, arquitetura web e apresentar iniciantes para as pessoas.",
  interests: ["Next.js", "TypeScript", "Cloud", "Arquitetura"],
  devfestGoals: "Quero guiar quem está indo pela 1ª vez e trocar ideias sobre Next.js Server Actions no evento.",
  cityOrState: "São Paulo - SP",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com/in/carlos-silva",
  whatsappOrTelegram: "@carlos_dev",
  portfolioUrl: "https://carlossilva.dev",
  projects: [
    {
      title: "Next.js Enterprise Starter",
      url: "https://github.com",
      description: "Boilerplate open-source para projetos escaláveis com Next.js 15 e Turbopack.",
    },
  ],
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  switchDemoUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("devfest_active_user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    // Começa como iniciante por padrão para testar a experiência
    setCurrentUser(defaultIniciante);
    localStorage.setItem("devfest_active_user", JSON.stringify(defaultIniciante));
  }, []);

  const handleSetUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("devfest_active_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("devfest_active_user");
    }
  };

  const switchDemoUser = (role: "mentor" | "iniciante") => {
    const target = role === "mentor" ? defaultMentor : defaultIniciante;
    handleSetUser(target);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetUser,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
