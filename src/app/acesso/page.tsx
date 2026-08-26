"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { TechBackground } from "@/components/TechBackground";
import { RawAILogo } from "@/components/RawAILogo";
import { projects } from "@/lib/projects";

const WHATSAPP =
  "https://wa.me/5561998229223?text=" +
  encodeURIComponent("Oi André! Quero acesso às ferramentas Raw AI.");

export default function AcessoPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const gated = projects.filter((p) => p.gated);

  async function submit() {
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(false);
    try {
      const r = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await r.json();
      if (d.ok) setUnlocked(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <TechBackground />
      <main className="flex min-h-screen items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-dim transition-colors hover:text-[var(--text)]">
            <ArrowLeft size={15} /> Raw AI
          </Link>

          {!unlocked ? (
            <div className="glass rounded-3xl p-8">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--cyan-bright)]">
                <Lock size={22} />
              </div>
              <h1 className="font-display text-2xl font-bold">Área restrita</h1>
              <p className="mt-2 text-sm text-muted">
                Ferramentas Raw AI em preparação. Tem um código de acesso? Digite abaixo. Não tem?{" "}
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-[var(--cyan-bright)]">
                  Fale com o André
                </a>
                .
              </p>
              <div className="mt-6 flex gap-2">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Código de acesso"
                  className="flex-1 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm outline-none placeholder:text-dim focus:border-[color:rgba(62,224,255,0.5)]"
                />
                <button
                  onClick={submit}
                  disabled={busy}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#04121a] disabled:opacity-60"
                  style={{ backgroundImage: "var(--grad)" }}
                >
                  Entrar
                </button>
              </div>
              {error && <p className="mt-3 text-xs text-[#ff8a6b]">Código inválido. Tente novamente.</p>}
            </div>
          ) : (
            <div className="glass rounded-3xl p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:rgba(52,245,160,0.3)] bg-[rgba(52,245,160,0.08)] px-3 py-1 text-xs font-semibold text-[var(--green)]">
                <ShieldCheck size={13} /> Acesso liberado
              </div>
              <h1 className="font-display text-2xl font-bold">Ferramentas Raw AI</h1>
              <p className="mt-1 text-sm text-muted">Projetos em preparação para venda. Quer um demo? Fale comigo.</p>
              <div className="mt-6 space-y-3">
                {gated.map((p) => (
                  <div key={p.slug} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                    <div className="font-display font-semibold">{p.name}</div>
                    <div className="mt-0.5 text-xs text-dim">{p.category.pt}</div>
                    <p className="mt-2 text-sm text-muted">{p.blurb.pt}</p>
                  </div>
                ))}
              </div>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#04121a]"
                style={{ backgroundImage: "var(--grad)" }}
              >
                Agendar um demo
              </a>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <RawAILogo className="opacity-40" />
          </div>
        </div>
      </main>
    </>
  );
}
