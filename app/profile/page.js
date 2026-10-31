"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { LEVELS, TOPICS } from "@/lib/matching";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    level: "iniciante",
    learning: [],
    teaching: [],
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    getDoc(doc(db, "profiles", user.uid)).then((snap) => {
      setForm((f) =>
        snap.exists() ? { ...f, ...snap.data() } : { ...f, name: user.displayName ?? "" },
      );
    });
  }, [user, loading, router]);

  const toggle = (key, topic) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(topic) ? f[key].filter((t) => t !== topic) : [...f[key], topic],
    }));

  async function save(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || (!form.learning.length && !form.teaching.length)) {
      setError("Informe seu nome e escolha ao menos um assunto.");
      return;
    }
    setSaving(true);
    try {
      // Sem banco criado ou sem rede, o Firestore tenta para sempre; o timeout evita travar a tela.
      await Promise.race([
        setDoc(doc(db, "profiles", user.uid), {
          name: form.name.trim(),
          level: form.level,
          learning: form.learning,
          teaching: form.teaching,
          bio: form.bio.trim(),
          photoURL: user.photoURL ?? "",
          updatedAt: serverTimestamp(),
        }),
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

  if (loading || !user) return null;

  return (
    <form onSubmit={save} className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Meu perfil</h1>

      <label className="flex flex-col gap-1">
        <span className="font-medium">Nome</span>
        <input
          className="input"
          value={form.name}
          maxLength={60}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-medium">Seu momento</legend>
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              type="button"
              key={l.value}
              onClick={() => setForm({ ...form, level: l.value })}
              className={form.level === l.value ? "chip chip-on" : "chip"}
            >
              {l.label}
            </button>
          ))}
        </div>
      </fieldset>

      <TopicPicker
        title="O que você quer aprender"
        selected={form.learning}
        onToggle={(t) => toggle("learning", t)}
      />
      <TopicPicker
        title="O que você pode ensinar"
        selected={form.teaching}
        onToggle={(t) => toggle("teaching", t)}
      />

      <label className="flex flex-col gap-1">
        <span className="font-medium">Sobre você (opcional)</span>
        <textarea
          className="input min-h-24"
          value={form.bio}
          maxLength={300}
          placeholder="Ex.: Estudo Flutter há 2 meses e quero entender como publicar meu primeiro app."
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button disabled={saving} className="btn-primary w-fit disabled:opacity-60">
        {saving ? "Salvando..." : "Salvar e ver matches"}
      </button>
    </form>
  );
}

function TopicPicker({ title, selected, onToggle }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 font-medium">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => onToggle(t)}
            className={selected.includes(t) ? "chip chip-on" : "chip"}
          >
            {t}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
