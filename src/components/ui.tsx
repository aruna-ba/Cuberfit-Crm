import type { StatutRisqueScore, NiveauAccompagnement, StatutCampagne } from "@/generated/prisma/enums";
import {
  risqueScoreBadgeClass,
  niveauAccompagnementBadgeClass,
  niveauAccompagnementLabel,
  statutRisqueScoreLabel,
  statutCampagneBadgeClass,
  statutCampagneLabel,
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
      <span className="inline-flex items-center rounded-full bg-[#F1F2FA] px-2.5 py-0.5 text-xs font-medium text-[#8891B0] ring-1 ring-inset ring-[#D5D9EC]">
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

export function CampagneStatutBadge({ statut }: { statut: StatutCampagne }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statutCampagneBadgeClass[statut]}`}
    >
      {statutCampagneLabel[statut]}
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
    <div className={`rounded-xl border border-[#E4E7F5] bg-white p-5 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8891B0]">
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
      <dt className="text-xs text-[#8891B0]">{label}</dt>
      <dd className="text-sm font-medium text-[#1B2340]">{value ?? "—"}</dd>
    </div>
  );
}

/// Libellé de champ avec icône d'aide optionnelle — reprend le motif
/// "Label ⓘ" du design system Figma (planche Composants, 2026-07-09).
export function FieldLabel({
  children,
  hint,
  htmlFor,
}: {
  children: React.ReactNode;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#5C6584]">
      {children}
      {hint && (
        <span
          title={hint}
          className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#D5D9EC] text-[9px] leading-none text-[#A6ACC4]"
        >
          i
        </span>
      )}
    </label>
  );
}

/// Classe partagée pour les champs de saisie — même rayon, bordure et focus
/// que les boutons, pour rester cohérent avec le design system Figma.
export const inputClass =
  "w-full rounded-lg border border-[#E4E7F5] bg-white px-3 py-1.5 text-sm text-[#1B2340] shadow-sm placeholder:text-[#A6ACC4] focus:border-[#3333CE] focus:outline-none focus:ring-1 focus:ring-[#3333CE] disabled:bg-[#F9FAFE] disabled:text-[#A6ACC4]";

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-[#3333CE] text-white hover:bg-[#2828a8] disabled:bg-[#C7CBEA]",
  secondary:
    "bg-white text-[#1B2340] ring-1 ring-inset ring-[#E4E7F5] hover:bg-[#F9FAFE] disabled:text-[#A6ACC4]",
  ghost: "bg-transparent text-[#3333CE] hover:bg-[#F1F2FA] disabled:text-[#A6ACC4]",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E97E0] disabled:cursor-not-allowed ${BUTTON_VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  );
}
