"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { IconLock } from "@/components/icons";
import { LEVELS, TOPICS, TOPIC_ICONS } from "@/lib/matching";

const STEPS = ["Seu momento", "Quero aprender", "Posso ensinar", "Finalizar"];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState({
    name: "",
    level: "iniciante",
    learning: [],
    teaching: [],
    bio: "",
  });
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    getDoc(doc(db, "profiles", user.uid)).then((snap) => {
      setIsNew(!snap.exists());
      setForm((f) =>
        snap.exists() ? { ...f, ...snap.data() } : { ...f, name: user.displayName ?? "" },
      );
    });
    getDoc(doc(db, "profiles", user.uid, "private", "contact"))
      .then((snap) => snap.exists() && setContact(snap.data().value ?? ""))
      .catch(() => {});
  }, [user, loading, router]);

  const toggle = (key, topic) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(topic) ? f[key].filter((t) => t !== topic) : [...f[key], topic],
    }));

  const last = step === STEPS.length - 1;
  const hasTopics = form.learning.length + form.teaching.length > 0;

  async function save() {
    setError("");
    if (!form.name.trim()) {
      setError("Informe seu nome para continuar.");
      return;
    }
    if (!hasTopics) {
      setError("Escolha ao menos um assunto (para aprender ou ensinar).");
      return;
    }
    setSaving(true);
    try {
      // Sem banco criado ou sem rede, o Firestore tenta para sempre; o timeout evita travar a tela.
      await Promise.race([
        Promise.all([
          setDoc(doc(db, "profiles", user.uid), {
            name: form.name.trim(),
            level: form.level,
            learning: form.learning,
            teaching: form.teaching,
            bio: form.bio.trim(),
            photoURL: user.photoURL ?? "",
            updatedAt: serverTimestamp(),
          }),
          // Documento privado: só quem tem um convite aceito com você consegue ler.
          setDoc(doc(db, "profiles", user.uid, "private", "contact"), {
            value: contact.trim().slice(0, 100),
          }),
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000)),
      ]);
      router.push("/matches");
    } catch (err) {
      console.error(err);
      setError(
        err.message === "timeout"
          ? "O banco não respondeu. Verifique se o Firestore foi criado no Firebase e tente de novo."
          : "Não foi possível salvar. Tente de novo.",
      );
      setSaving(false);
    }
  }

  if (loading || !user) {
    return <div className="skeleton h-64 w-full" aria-busy="true" />;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isNew ? "Vamos montar seu perfil" : "Editar perfil"}
        </h1>
        <p className="mt-1 text-muted">
          {isNew
            ? "São 4 passos rápidos. Com isso, mostramos pessoas que combinam com você."
            : "Atualize o que mudou e salve no último passo."}
        </p>
      </div>

      <Progress step={step} onGo={setStep} />

      <section className="card flex flex-col gap-5" aria-live="polite">
        {step === 0 && (
          <>
            <StepTitle title="Como você se sente hoje na área de tecnologia?" />
            <div className="grid gap-3 sm:grid-cols-2">
              {LEVELS.map((l) => (
                <button
                  type="button"
                  key={l.value}
                  aria-pressed={form.level === l.value}
                  onClick={() => setForm({ ...form, level: l.value })}
                  className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                    form.level === l.value
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:bg-surface-2"
                  }`}
                >
                  <span className="text-3xl">{l.icon}</span>
                  <span className="mt-2 block font-semibold">{l.label}</span>
                  <span className="mt-0.5 block text-sm text-muted">{l.description}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <TopicStep
            title="O que você quer aprender?"
            hint="Escolha quantos quiser. Vamos procurar quem ensina esses assuntos."
            selected={form.learning}
            onToggle={(t) => toggle("learning", t)}
          />
        )}

        {step === 2 && (
          <TopicStep
            title="O que você pode ensinar?"
            hint={
              form.level === "iniciante"
                ? "Mesmo começando, você sabe algo que ajuda outra pessoa. Pode pular se preferir."
                : "Escolha o que você domina e gostaria de compartilhar."
            }
            selected={form.teaching}
            onToggle={(t) => toggle("teaching", t)}
          />
        )}

        {step === 3 && (
          <>
            <StepTitle title="Últimos detalhes" />
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Como quer ser chamado(a)?</span>
              <input
                className="input"
                value={form.name}
                maxLength={60}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                Sobre você <span className="font-normal text-muted">(opcional)</span>
              </span>
              <textarea
                className="input min-h-24"
                value={form.bio}
                maxLength={300}
                placeholder="Ex.: Estudo Flutter há 2 meses e quero entender como publicar meu primeiro app."
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <span className="text-xs text-muted">
                Ajuda a IA a explicar por que vocês combinam. {form.bio.length}/300
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                Contato <span className="font-normal text-muted">(opcional)</span>
              </span>
              <input
                className="input"
                value={contact}
                maxLength={100}
                placeholder="WhatsApp, Instagram ou LinkedIn"
                onChange={(e) => setContact(e.target.value)}
              />
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <IconLock width={14} height={14} />
                Só aparece para quem tiver um convite aceito com você.
              </span>
            </label>
          </>
        )}
      </section>

      {error && (
        <p role="alert" className="rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="btn-ghost disabled:invisible"
        >
          Voltar
        </button>
        {last ? (
          <button onClick={save} disabled={saving} className="btn-primary btn-lg">
            {saving ? "Salvando..." : isNew ? "Salvar e ver matches" : "Salvar alterações"}
          </button>
        ) : (
          <button onClick={() => setStep((s) => s + 1)} className="btn-primary btn-lg">
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}

function Progress({ step, onGo }) {
  return (
    <nav aria-label="Passos do perfil">
      <ol className="flex gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => onGo(i)}
              aria-current={i === step ? "step" : undefined}
              className="group w-full text-left"
            >
              <span
                className={`block h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
              />
              <span
                className={`mt-1.5 hidden text-xs font-medium sm:block ${
                  i === step ? "text-foreground" : "text-muted"
                }`}
              >
                {i + 1}. {label}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs font-medium text-muted sm:hidden">
        Passo {step + 1} de {STEPS.length}: {STEPS[step]}
      </p>
    </nav>
  );
}

function StepTitle({ title, hint }) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

function TopicStep({ title, hint, selected, onToggle }) {
  return (
    <>
      <StepTitle title={title} hint={hint} />
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            type="button"
            key={t}
            aria-pressed={selected.includes(t)}
            onClick={() => onToggle(t)}
            className={selected.includes(t) ? "chip chip-on" : "chip"}
          >
            <span aria-hidden="true">{TOPIC_ICONS[t]}</span>
            {t}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">
        {selected.length === 0 ? "Nenhum assunto selecionado." : `${selected.length} selecionado(s).`}
      </p>
    </>
  );
}
