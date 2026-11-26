"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";

export function Gate({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/personal/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      setError(res.status === 401 ? "Senha incorreta." : "Área indisponível no momento.");
      setPassword("");
    } catch {
      setError("Sem conexão. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="pz-gate">
      <div className="pz-gate-bg" aria-hidden="true" />
      <form className="pz-gate-card" onSubmit={submit}>
        <Link href="/" className="pz-back">
          <ArrowLeft size={14} /> Raw AI
        </Link>
        <div className="pz-gate-lock">
          <Lock size={26} />
        </div>
        <h1 className="pz-poster pz-gate-title">Personal</h1>
        <p className="pz-gate-sub">Esconderijo privado. Só entra quem tem a senha.</p>
        {configured ? (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              aria-label="Senha"
              autoComplete="current-password"
              autoFocus
              className="pz-input pz-gate-input"
            />
            <button type="submit" disabled={busy || !password} className="pz-btn pz-btn-hot pz-gate-btn">
              {busy ? "Abrindo…" : "Entrar"}
            </button>
          </>
        ) : (
          <p className="pz-gate-err">Área ainda não configurada neste servidor.</p>
        )}
        {error && (
          <p className="pz-gate-err" role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
