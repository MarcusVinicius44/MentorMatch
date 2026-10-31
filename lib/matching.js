export const TOPICS = [
  "Web",
  "Mobile",
  "Flutter",
  "Android",
  "Cloud",
  "Firebase",
  "IA / ML",
  "Gemini",
  "Dados",
  "DevOps",
  "Segurança",
  "UX / Design",
  "Carreira",
  "Open Source",
];

export const TOPIC_ICONS = {
  Web: "🌐",
  Mobile: "📱",
  Flutter: "🦋",
  Android: "🤖",
  Cloud: "☁️",
  Firebase: "🔥",
  "IA / ML": "🧠",
  Gemini: "✨",
  Dados: "📊",
  DevOps: "⚙️",
  Segurança: "🔒",
  "UX / Design": "🎨",
  Carreira: "🚀",
  "Open Source": "💚",
};

export const LEVELS = [
  {
    value: "iniciante",
    label: "Estou começando",
    description: "Quero aprender com quem já está no caminho.",
    icon: "🌱",
  },
  {
    value: "experiente",
    label: "Tenho experiência",
    description: "Posso ajudar quem está chegando agora.",
    icon: "🧭",
  },
];

// Rótulo amigável para a pontuação, em vez de mostrar um número cru.
export function matchStrength(score) {
  if (score >= 5) return { label: "Match forte", tone: "success" };
  if (score >= 3) return { label: "Bom match", tone: "primary" };
  return { label: "Match possível", tone: "muted" };
}

// Pontua o quanto `candidate` combina com `me`:
// o que eu quero aprender x o que ele ensina (peso 2), e o inverso (peso 1).
// Pares iniciante <-> experiente ganham um bônus.
export function scoreMatch(me, candidate) {
  const learn = overlap(me.learning, candidate.teaching);
  const teach = overlap(me.teaching, candidate.learning);
  const bonus = me.level !== candidate.level ? 1 : 0;
  const score = learn.length * 2 + teach.length + (learn.length ? bonus : 0);
  return { score, learn, teach };
}

export function rankMatches(me, candidates, limit = 8) {
  return candidates
    .filter((c) => c.uid !== me.uid)
    .map((c) => ({ profile: c, ...scoreMatch(me, c) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function overlap(a = [], b = []) {
  const set = new Set(b);
  return a.filter((t) => set.has(t));
}
