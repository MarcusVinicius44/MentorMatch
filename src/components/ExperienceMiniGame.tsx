"use client";

import { useState } from "react";
import { UserRole, UserProfile } from "@/types";
import {
  Gamepad2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Code2,
  BrainCircuit,
  Terminal,
  Trophy,
} from "lucide-react";

export interface MiniGameResult {
  suggestedRole: UserRole;
  suggestedSeniority: UserProfile["seniority"];
  selectedStacks: string[];
  score: number;
}

interface ExperienceMiniGameProps {
  onComplete: (result: MiniGameResult) => void;
  onSkip: () => void;
}

interface Question {
  id: number;
  question: string;
  description?: string;
  options: {
    label: string;
    points: number; // 0 = iniciante, 1 = junior/transição, 2 = pleno, 3 = senior/lead
    feedback: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Como você lida quando aparece um erro 500 ou bug bizarro em produção no Next.js?",
    description: "Cenário clássico de sexta-feira à tarde!",
    options: [
      {
        label: "Fico sem saber por onde começar ou copio o erro correndo pro ChatGPT/Google.",
        points: 0,
        feedback: "Super comum! Todo mundo começa assim desvendando os logs.",
      },
      {
        label: "Dou uma olhada no console do navegador e tento colocar console.log pra rastrear.",
        points: 1,
        feedback: "Boa! Você já entende o fluxo de depuração inicial.",
      },
      {
        label: "Analiso os logs do servidor, stack trace, replico localmente e crio um teste.",
        points: 2,
        feedback: "Excelente! Metodologia sólida de depuração backend/frontend.",
      },
      {
        label: "Verifico métricas de observabilidade, trace distribuído, aplico rollback e mitigo com post-mortem.",
        points: 3,
        feedback: "Casca grossa! Experiência de quem já apagou muito incêndio em produção.",
      },
    ],
  },
  {
    id: 2,
    question: "Qual é o seu nível de intimidade com arquitetura e Next.js App Router?",
    options: [
      {
        label: "Estou aprendendo o que é componente, props e useState agora.",
        points: 0,
        feedback: "O início da jornada no React é a fase mais mágica!",
      },
      {
        label: "Já criei páginas, rotas com parâmetros e consumo de APIs básicas.",
        points: 1,
        feedback: "Muito bom! A base de desenvolvimento web já está com você.",
      },
      {
        label: "Domino Server Components vs Client Components, Server Actions e caching.",
        points: 2,
        feedback: "Avançado! Você já usa o poder real do Next.js moderno.",
      },
      {
        label: "Arquiteto monorepos, micro-frontends, ISR/PPR e desenho pipelines de CI/CD.",
        points: 3,
        feedback: "Visão estratégica de ponta a ponta e liderança técnica.",
      },
    ],
  },
  {
    id: 3,
    question: "O que você sente mais vontade de fazer no DevFest?",
    options: [
      {
        label: "Achar alguém experiente para me dar dicas de estudo e não ficar perdido no evento.",
        points: 0,
        feedback: "O lema 'Ninguém precisa ir sozinho' foi feito especialmente para você!",
      },
      {
        label: "Assistir palestras e ver como a galera do mercado aplica as tecnologias no dia a dia.",
        points: 1,
        feedback: "Excelente para se inspirar e abrir portas na carreira.",
      },
      {
        label: "Debater arquitetura, trocar figurinhas técnicas de igual para igual e fazer networking.",
        points: 2,
        feedback: "O evento vai render conexões profissionais muito ricas para você.",
      },
      {
        label: "Ajudar a guiar quem tá começando, compartilhar o que aprendi e orientar no evento.",
        points: 3,
        feedback: "Espírito de comunidade puro! Mentores fazem toda a diferença.",
      },
    ],
  },
];

const AVAILABLE_STACKS = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Firebase",
  "Google Cloud (GCP)",
  "IA / Gemini API",
  "GraphQL",
  "PostgreSQL",
  "Docker",
  "Mobile / Flutter",
  "Python",
];

export function ExperienceMiniGame({ onComplete, onSkip }: ExperienceMiniGameProps) {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = intro, 1..3 = perguntas, 4 = stacks, 5 = resultado
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedStacks, setSelectedStacks] = useState<string[]>(["Next.js"]);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const totalQuestions = QUESTIONS.length;

  const handleSelectOption = (points: number, feedback: string) => {
    setSelectedFeedback(feedback);
    setTimeout(() => {
      setSelectedFeedback(null);
      const newAnswers = [...answers, points];
      setAnswers(newAnswers);

      if (currentStep < totalQuestions) {
        setCurrentStep(currentStep + 1);
      } else {
        // Vai para a seleção de stacks
        setCurrentStep(totalQuestions + 1);
      }
    }, 700);
  };

  const toggleStack = (stack: string) => {
    if (selectedStacks.includes(stack)) {
      setSelectedStacks(selectedStacks.filter((s) => s !== stack));
    } else {
      setSelectedStacks([...selectedStacks, stack]);
    }
  };

  // Calcular resultado
  const totalScore = answers.reduce((acc, curr) => acc + curr, 0);
  // Score max: 9 (3 perguntas x max 3 pontos)
  let suggestedRole: UserRole = "iniciante";
  let suggestedSeniority: UserProfile["seniority"] = "Iniciante";

  if (totalScore >= 7) {
    suggestedRole = "mentor";
    suggestedSeniority = totalScore >= 8 ? "Senior" : "Especialista";
  } else if (totalScore >= 4) {
    // Intermediário / Pleno ou mentor aspirante
    suggestedRole = "mentor";
    suggestedSeniority = "Pleno";
  } else if (totalScore >= 2) {
    suggestedRole = "iniciante";
    suggestedSeniority = "Junior";
  } else {
    suggestedRole = "iniciante";
    suggestedSeniority = "Iniciante";
  }

  const handleFinish = () => {
    onComplete({
      suggestedRole,
      suggestedSeniority,
      selectedStacks: selectedStacks.length > 0 ? selectedStacks : ["Next.js", "TypeScript"],
      score: totalScore,
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-indigo-500/20 dark:border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Barra de progresso superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300"
          style={{
            width: `${Math.min(100, (currentStep / (totalQuestions + 1)) * 100)}%`,
          }}
        />
      </div>

      {/* TELA 0: INTRODUÇÃO */}
      {currentStep === 0 && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
            <Gamepad2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Minigame DevFest Match 🎮
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
              Descubra seu Papel no Evento!
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Responda a 3 perguntinhas rápidas e divertidas para descobrirmos suas stacks e sugerirmos se você deve ir como <strong>Iniciante / Mentorado</strong> ou <strong>Mentor Senior</strong> no DevFest!
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Jogar Minigame (1 min)
            </button>
            <button
              onClick={onSkip}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition"
            >
              Pular e escolher manualmente &rarr;
            </button>
          </div>
        </div>
      )}

      {/* PERGUNTAS 1 a 3 */}
      {currentStep >= 1 && currentStep <= totalQuestions && (
        <div className="py-2 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
            <span>
              Pergunta {currentStep} de {totalQuestions}
            </span>
            <span className="text-blue-600 dark:text-blue-400">Quiz de Experiência</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
              {QUESTIONS[currentStep - 1].question}
            </h3>
            {QUESTIONS[currentStep - 1].description && (
              <p className="text-xs text-zinc-500 italic">
                {QUESTIONS[currentStep - 1].description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {QUESTIONS[currentStep - 1].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt.points, opt.feedback)}
                className="w-full text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 hover:border-blue-400 transition flex items-start gap-3 group"
              >
                <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {selectedFeedback && (
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 text-xs font-semibold animate-pulse text-center">
              💡 {selectedFeedback}
            </div>
          )}
        </div>
      )}

      {/* SELEÇÃO DE STACKS */}
      {currentStep === totalQuestions + 1 && (
        <div className="py-2 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Terminal className="w-4 h-4" />
              <span>Etapa Final do Minigame</span>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              Quais stacks e tecnologias você utiliza ou quer aprender?
            </h3>
            <p className="text-xs text-zinc-500">
              Selecione todas que fazem sentido para o seu momento no DevFest:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_STACKS.map((stack) => {
              const isSelected = selectedStacks.includes(stack);
              return (
                <button
                  key={stack}
                  type="button"
                  onClick={() => toggleStack(stack)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs scale-102"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  #{stack}
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <span className="text-xs text-zinc-400">
              {selectedStacks.length} stack(s) selecionada(s)
            </span>
            <button
              onClick={() => setCurrentStep(totalQuestions + 2)}
              disabled={selectedStacks.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              <span>Ver Resultado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RESULTADO FINAL DO MINIGAME */}
      {currentStep === totalQuestions + 2 && (
        <div className="text-center py-4 space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Perfil Analisado com Sucesso! 🎯
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
              Sugerimos você como:{" "}
              <span
                className={
                  suggestedRole === "mentor"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }
              >
                {suggestedRole === "mentor" ? "Mentor Senior" : "Iniciante / Junior"}
              </span>
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Nível sugerido: <strong>{suggestedSeniority}</strong> &bull; Pontuação do Quiz:{" "}
              {totalScore} pts.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto text-left space-y-2">
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Suas Stacks para o DevFest:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedStacks.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold"
                >
                  #{s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setAnswers([]);
                setCurrentStep(1);
              }}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Refazer Minigame
            </button>

            <button
              onClick={handleFinish}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Aplicar e Preencher Perfil</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
