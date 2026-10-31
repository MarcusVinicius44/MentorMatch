export type UserRole = "mentor" | "iniciante";

export interface ProjectLink {
  title: string;
  url: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  seniority: "Iniciante" | "Junior" | "Pleno" | "Senior" | "Especialista";
  bio: string;
  avatarUrl?: string; // Foto ou avatar do perfil
  interests: string[]; // Trilha de interesse no DevFest / stacks (ex: Next.js, Cloud, IA, Mobile)
  devfestGoals: string; // Ex: "Quero conhecer pessoas, entender Server Components e fazer networking"
  cityOrState?: string; // Ex: "São Paulo - SP"
  whatsappOrTelegram?: string; // Para facilitar combinar encontro presencial no evento
  
  // Redes Sociais
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  portfolioUrl?: string;

  // Projetos
  projects?: ProjectLink[];

  createdAt?: number;
}

export interface MatchRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  menteeId: string;
  menteeName: string;
  menteeEmail: string;
  menteeContact?: string;
  message: string;
  interestTopic: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
}

export interface DevFestEventDate {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "warmup" | "hackathon" | "evento" | "mentoria" | "after";
  location: string;
  description: string;
  link?: string;
}
