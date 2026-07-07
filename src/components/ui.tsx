import type { StatutRisqueScore, NiveauAccompagnement } from "@/generated/prisma/enums";
import {
  risqueScoreBadgeClass,
  niveauAccompagnementBadgeClass,
  niveauAccompagnementLabel,
  statutRisqueScoreLabel,
} from "@/lib/labels";

export function RisqueScoreBadge({
  score,
  statut,
}: {
  score?: number;
  statut?: StatutRisqueScore;
}) {
  if (score === undefined || statut === undefined) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-600/20">
        Non calculé
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${risqueScoreBadgeClass[statut]}`}
    >
      <span className="font-semibold">{score}</span>
      <span>· {statutRisqueScoreLabel[statut]}</span>
    </span>
  );
}

export function AccompagnementBadge({ niveau }: { niveau: NiveauAccompagnement }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${niveauAccompagnementBadgeClass[niveau]}`}
    >
      {niveauAccompagnementLabel[niveau]}
    </span>
  );
}

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-1.5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value ?? "—"}</dd>
    </div>
  );
}
