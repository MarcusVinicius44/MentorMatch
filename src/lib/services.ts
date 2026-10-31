import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { MatchRequest, UserProfile, DevFestEventDate } from "@/types";

export const UPCOMING_EVENTS: DevFestEventDate[] = [
  {
    id: "evt-1",
    title: "DevFest Warm-up & Encontro de Boas-Vindas",
    date: "14 de Novembro, 2026",
    time: "19h30 - 21h00",
    type: "warmup",
    location: "Google Meet / YouTube GDG",
    description: "Conexão online antes do evento para quem vai pela 1ª vez. Dicas para aproveitar as trilhas e montar duplas.",
  },
  {
    id: "evt-2",
    title: "Hackathon DevFest & Google Cloud Challenge",
    date: "21 de Novembro, 2026",
    time: "09h00 - 18h00",
    type: "hackathon",
    location: "Campus GDG / Híbrido",
    description: "Desenvolva soluções com Next.js, Firebase e Gemini. Times com mentores seniores e iniciantes juntos!",
  },
  {
    id: "evt-3",
    title: "DevFest 2026 - O Grande Dia!",
    date: "28 de Novembro, 2026",
    time: "08h00 - 19h00",
    type: "evento",
    location: "Centro de Convenções & Eventos",
    description: "O maior evento de tecnologia da comunidade Google. Palestras em 4 palcos, workshops, networking e área de mentoria.",
  },
  {
    id: "evt-4",
    title: "Espaço MentorMatch no DevFest (Mentoria 1-on-1)",
    date: "28 de Novembro, 2026",
    time: "14h00 - 16h30",
    type: "mentoria",
    location: "Área de Comunidades - Lounge GDG",
    description: "Ponto de encontro físico oficial para quem deu match na plataforma se encontrar para tomar um café e conversar.",
  },
];

const MOCK_PROFILES: UserProfile[] = [
  {
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
      {
        title: "Community Tech Talk Blog",
        url: "https://github.com",
        description: "Artigos e tutoriais práticos sobre boas práticas e arquitetura limpa.",
      },
    ],
  },
  {
    id: "mentor-2",
    name: "Beatriz Almeida",
    email: "beatriz.dev@tech.com",
    role: "mentor",
    seniority: "Especialista",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    bio: "Staff Frontend & Community Lead. Se você é introvertido ou tá com vergonha de ir sozinho, vem comigo assistir às palestras de Frontend e IA!",
    interests: ["Next.js", "Design Systems", "IA Aplicada", "Carreira"],
    devfestGoals: "Apresentar a comunidade GDG para novas pessoas e tomar um café enquanto trocamos feedbacks.",
    cityOrState: "Campinas - SP",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com/in/beatriz-dev",
    whatsappOrTelegram: "@beatriz_gdg",
    twitterUrl: "https://x.com/beatriz_frontend",
    projects: [
      {
        title: "A11y UI Kit",
        url: "https://github.com",
        description: "Biblioteca de componentes acessíveis com suporte a WCAG AAA e temas inclusivos.",
      },
    ],
  },
  {
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
  },
  {
    id: "iniciante-2",
    name: "Mariana Costa",
    email: "mariana.costa@email.com",
    role: "iniciante",
    seniority: "Junior",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    bio: "Junior Developer focada em Next.js e Tailwind. Quero fazer contatos, entender as trilhas de IA e aprender com quem já está na área.",
    interests: ["Next.js", "TypeScript", "IA Aplicada", "Comunidade"],
    devfestGoals: "Quero uma companhia para debater as palestras da trilha de web e conseguir dicas de carreira.",
    cityOrState: "Guarulhos - SP",
    linkedinUrl: "https://linkedin.com/in/mariana-costa",
    githubUrl: "https://github.com/mariana-costa",
    projects: [
      {
        title: "Prompt Hub",
        url: "https://github.com",
        description: "Aplicação Next.js para catalogar e testar prompts com a API do Gemini.",
      },
    ],
  },
];

const LOCAL_STORAGE_PROFILES = "devfest_match_profiles";
const LOCAL_STORAGE_MATCHES = "devfest_match_requests";

function getLocalProfiles(): UserProfile[] {
  if (typeof window === "undefined") return MOCK_PROFILES;
  const data = localStorage.getItem(LOCAL_STORAGE_PROFILES);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_PROFILES, JSON.stringify(MOCK_PROFILES));
    return MOCK_PROFILES;
  }
  return JSON.parse(data);
}

function saveLocalProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  const profiles = getLocalProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.unshift(profile);
  }
  localStorage.setItem(LOCAL_STORAGE_PROFILES, JSON.stringify(profiles));
}

function getLocalMatches(): MatchRequest[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_STORAGE_MATCHES);
  return data ? JSON.parse(data) : [];
}

function saveLocalMatch(request: MatchRequest) {
  if (typeof window === "undefined") return;
  const list = getLocalMatches();
  const index = list.findIndex((m) => m.id === request.id);
  if (index >= 0) {
    list[index] = request;
  } else {
    list.unshift(request);
  }
  localStorage.setItem(LOCAL_STORAGE_MATCHES, JSON.stringify(list));
}

// ====================== SERVIÇOS FIRESTORE COM FALLBACK ======================

export async function getAllProfiles(roleFilter?: "mentor" | "iniciante"): Promise<UserProfile[]> {
  try {
    if (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key") {
      let q = query(collection(db, "users"));
      if (roleFilter) {
        q = query(collection(db, "users"), where("role", "==", roleFilter));
      }
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile));
      }
    }
  } catch (err) {
    console.warn("Firestore fallback para perfis:", err);
  }

  const list = getLocalProfiles();
  if (roleFilter) {
    return list.filter((p) => p.role === roleFilter);
  }
  return list;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);
  try {
    if (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key") {
      await setDoc(doc(db, "users", profile.id), profile, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore erro ao salvar usuário:", err);
  }
}

export async function requestMatch(
  request: Omit<MatchRequest, "id" | "createdAt" | "status">
): Promise<MatchRequest> {
  const newRequest: MatchRequest = {
    ...request,
    id: "match-" + Date.now(),
    status: "pending",
    createdAt: Date.now(),
  };

  saveLocalMatch(newRequest);

  try {
    if (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key") {
      const ref = await addDoc(collection(db, "matches"), newRequest);
      newRequest.id = ref.id;
    }
  } catch (err) {
    console.warn("Firestore erro ao salvar match:", err);
  }

  return newRequest;
}

export async function getMatchesForUser(userId: string): Promise<MatchRequest[]> {
  try {
    if (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key") {
      const q = query(
        collection(db, "matches"),
        where("mentorId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const mentorMatches = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MatchRequest));

      const q2 = query(
        collection(db, "matches"),
        where("menteeId", "==", userId)
      );
      const snapshot2 = await getDocs(q2);
      const menteeMatches = snapshot2.docs.map((d) => ({ id: d.id, ...d.data() } as MatchRequest));

      return [...mentorMatches, ...menteeMatches];
    }
  } catch (err) {
    console.warn("Firestore erro ao carregar conexões:", err);
  }

  const all = getLocalMatches();
  return all.filter((m) => m.mentorId === userId || m.menteeId === userId);
}

export async function updateMatchStatus(
  matchId: string,
  status: "accepted" | "rejected"
): Promise<void> {
  const matches = getLocalMatches();
  const match = matches.find((m) => m.id === matchId);
  if (match) {
    match.status = status;
    saveLocalMatch(match);
  }

  try {
    if (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key") {
      const docRef = doc(db, "matches", matchId);
      await updateDoc(docRef, { status });
    }
  } catch (err) {
    console.warn("Firestore erro ao atualizar status:", err);
  }
}
