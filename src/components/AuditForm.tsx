"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { useLang, pick, type Lang } from "@/lib/lang";
import { STEPS, fieldError, whatsAppUrl, type Answers, type Field } from "@/lib/auditForm";

const ERRORS = {
  required: { pt: "Campo obrigatório", en: "Required" },
  email: { pt: "Email inválido", en: "Invalid email" },
  phone: { pt: "Número inválido", en: "Invalid number" },
};

const inputCls =
  "w-full rounded-xl border border-white/10 bg-[rgba(5,7,13,0.6)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--dim)] outline-none transition focus:border-[var(--cyan-bright)] focus:shadow-[0_0_0_3px_rgba(62,224,255,0.15)]";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition ${
        active
          ? "border-[var(--green)] bg-[rgba(52,245,160,0.12)] text-[var(--text)]"
          : "border-white/10 text-muted hover:border-white/25 hover:text-[var(--text)]"
      }`}
    >
      {active && <Check size={12} className="text-[var(--green)]" />}
      {children}
    </button>
  );
}

function FieldInput({ f, value, lang, onChange }: { f: Field; value: string | string[] | undefined; lang: Lang; onChange: (v: string | string[]) => void }) {
  const ph = f.placeholder ? pick(lang, f.placeholder) : undefined;
  if (f.kind === "single" || f.kind === "multi") {
    const sel = Array.isArray(value) ? value : value ? [value] : [];
    const toggle = (v: string) =>
      f.kind === "single"
        ? onChange(sel[0] === v ? "" : v)
        : onChange(sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]);
    return (
      <div className="flex flex-wrap gap-2">
        {f.options!.map((op) => (
          <Chip key={op.value} active={sel.includes(op.value)} onClick={() => toggle(op.value)}>
            {pick(lang, op.label)}
          </Chip>
        ))}
      </div>
    );
  }
  const str = typeof value === "string" ? value : "";
  if (f.kind === "textarea")
    return <textarea id={f.id} rows={3} className={inputCls} placeholder={ph} value={str} onChange={(e) => onChange(e.target.value)} />;
  return <input id={f.id} type={f.kind} className={inputCls} placeholder={ph} value={str} onChange={(e) => onChange(e.target.value)} />;
}

export function AuditForm() {
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const current = STEPS[step];
  const last = step === STEPS.length - 1;
  const errors = Object.fromEntries(current.fields.map((f) => [f.id, fieldError(f, answers[f.id])]));
  const stepValid = Object.values(errors).every((e) => !e);
  const set = (id: string, v: string | string[]) => setAnswers((a) => ({ ...a, [id]: v }));

  const scrollTop = () => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Open WhatsApp synchronously inside the click so popup blockers allow it.
  function submit() {
    const url = whatsAppUrl(answers);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
    setSent(true);
    scrollTop();
  }

  function next() {
    setTouched(true);
    if (!stepValid) return;
    setTouched(false);
    if (last) submit();
    else { setStep((s) => s + 1); scrollTop(); }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--grad)" }}>
          <Check size={30} className="text-[#04121a]" />
        </div>
        <h3 className="text-2xl font-bold">
          {pick(lang, { pt: "Último passo: toque em Enviar no WhatsApp", en: "Last step: tap Send in WhatsApp" })}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          {pick(lang, {
            pt: "Seu WhatsApp abriu com todas as respostas prontas pra mim. É só enviar — eu analiso seu negócio e te respondo por lá.",
            en: "Your WhatsApp opened with all your answers ready for me. Just hit send — I'll analyze your business and reply there.",
          })}
        </p>
        <a href={whatsAppUrl(answers)} target="_blank" rel="noopener noreferrer"
           className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a]" style={{ backgroundImage: "var(--grad)" }}>
          {pick(lang, { pt: "Abrir o WhatsApp de novo", en: "Open WhatsApp again" })}
        </a>
      </motion.div>
    );
  }

  return (
    <div>
      {/* progress */}
      <div className="mb-6 flex items-center justify-between gap-4 text-xs">
        <span className="font-semibold uppercase tracking-[0.18em] text-[var(--cyan-bright)]">
          {pick(lang, { pt: "Etapa", en: "Step" })} {step + 1}/{STEPS.length}
        </span>
        <span className="text-muted">{pick(lang, { pt: "~4 minutos", en: "~4 minutes" })}</span>
      </div>
      <div className="mb-8 flex gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
            <motion.div className="h-full" style={{ background: "var(--grad)" }} initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <h3 className="text-2xl font-bold tracking-tight">{pick(lang, current.title)}</h3>
          <p className="mt-1 text-sm text-muted">{pick(lang, current.hint)}</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {current.fields.map((f) => {
              const err = touched ? errors[f.id] : null;
              const chips = f.kind === "single" || f.kind === "multi";
              return (
                <div key={f.id} className={f.wide || chips || f.kind === "textarea" ? "sm:col-span-2" : ""}>
                  <label htmlFor={f.id} className="mb-2 block text-sm font-medium text-[var(--text)]">
                    {pick(lang, f.label)}
                    {f.required && <span className="ml-1 text-[var(--green)]">*</span>}
                  </label>
                  <FieldInput f={f} value={answers[f.id]} lang={lang} onChange={(v) => set(f.id, v)} />
                  {err && <p className="mt-1.5 text-xs text-[#ff7a7a]">{pick(lang, ERRORS[err])}</p>}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => { setStep((s) => s - 1); setTouched(false); }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-muted transition hover:text-[var(--text)]">
            <ArrowLeft size={15} /> {pick(lang, { pt: "Voltar", en: "Back" })}
          </button>
        ) : <span />}
        <button type="button" onClick={next}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a] transition-transform hover:-translate-y-0.5"
                style={{ backgroundImage: "var(--grad)" }}>
          {last ? <><Send size={15} /> {pick(lang, { pt: "Enviar pelo WhatsApp", en: "Send via WhatsApp" })}</>
            : <>{pick(lang, { pt: "Continuar", en: "Continue" })} <ArrowRight size={15} /></>}
        </button>
      </div>
      {touched && !stepValid && (
        <p className="mt-3 text-right text-xs text-[#ff7a7a]">{pick(lang, { pt: "Preencha os campos marcados com *", en: "Fill in the fields marked *" })}</p>
      )}
      <p className="mt-6 text-center text-[11px] text-[var(--dim)]">
        {pick(lang, { pt: "Suas respostas vão direto pra mim e não são compartilhadas com ninguém.", en: "Your answers come straight to me and are never shared." })}
      </p>
    </div>
  );
}

