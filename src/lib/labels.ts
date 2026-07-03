import type {
  Segment,
  NiveauAccompagnement,
  PhaseLifecycle,
  StatutHealthScore,
  StatutAbonnement,
  TypeActivitePartenaire,
  TypeInteraction,
} from "@/generated/prisma/enums";

export const segmentLabel: Record<Segment, string> = {
  PASSIONNE: "Passionné",
  PARTENAIRE: "Partenaire",
  ENTREPRISE_QVT: "Entreprise QVT",
};

export const niveauAccompagnementLabel: Record<NiveauAccompagnement, string> = {
  TECH_TOUCH: "Tech-touch",
  LOW_TOUCH: "Low-touch",
  HIGH_TOUCH: "High-touch",
};

export const phaseLifecycleLabel: Record<PhaseLifecycle, string> = {
  ONBOARDING: "Onboarding",
  ADOPTION: "Adoption",
  EXPANSION: "Expansion",
  A_RISQUE: "À risque",
  CHURN: "Churn",
};

export const statutHealthScoreLabel: Record<StatutHealthScore, string> = {
  VERT: "Sain",
  ORANGE: "À surveiller",
  ROUGE: "À risque",
};

export const statutAbonnementLabel: Record<StatutAbonnement, string> = {
  AUCUN: "Aucun",
  ACCESS: "Access",
  PLAY: "Play",
  ACCESS_PLAY: "Access + Play",
};

export const typeActivitePartenaireLabel: Record<TypeActivitePartenaire, string> = {
  SALLE: "Salle",
  STUDIO: "Studio",
  COACH_INDEPENDANT: "Coach indépendant",
  ESPACE_BIEN_ETRE: "Espace bien-être",
};

export const typeInteractionLabel: Record<TypeInteraction, string> = {
  ACHAT: "Achat",
  TICKET: "Ticket",
  CAMPAGNE: "Campagne",
  APPEL_AGENT_VOCAL: "Appel agent vocal",
  HEALTH_SCORE_CHANGE: "Évolution Health Score",
  NOTE: "Note",
};

export const healthScoreBadgeClass: Record<StatutHealthScore, string> = {
  VERT: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  ORANGE: "bg-amber-100 text-amber-800 ring-amber-600/20",
  ROUGE: "bg-red-100 text-red-800 ring-red-600/20",
};

export const niveauAccompagnementBadgeClass: Record<NiveauAccompagnement, string> = {
  TECH_TOUCH: "bg-sky-100 text-sky-800 ring-sky-600/20",
  LOW_TOUCH: "bg-slate-100 text-slate-700 ring-slate-600/20",
  HIGH_TOUCH: "bg-violet-100 text-violet-800 ring-violet-600/20",
};
