import type { Segment } from "@/generated/prisma/enums";
import type { KpiDefinitionVM, KpiSnapshotVM, CohorteRetentionVM, SensAmelioration } from "@/lib/types";

/**
 * Données de démonstration pour le module P1-2 (Analytics & reporting).
 * Les 18 KPIs (6 par segment) et leurs cibles reprennent mot pour mot la
 * grille de KPIs de référence du prompt de cadrage (section 3) — "cibles
 * indicatives sans baseline réelle" acceptées telles quelles par Harouna.
 * L'historique mensuel est une simulation de démonstration ; les alertes et
 * cohortes sont dérivées dynamiquement, à remplacer par de vraies requêtes
 * Prisma/Amplitude une fois la base et l'intégration branchées.
 */

const MOIS: string[] = [
  "2026-02-01",
  "2026-03-01",
  "2026-04-01",
  "2026-05-01",
  "2026-06-01",
  "2026-07-01",
];

export const KPI_DEFINITIONS: KpiDefinitionVM[] = [
  // ----- Passionnés -----
  { code: "TAUX_ACTIVATION", segment: "PASSIONNE", libelle: "Taux d'activation", unite: "%", cible: 60, sens: "PLUS_EST_MIEUX" },
  { code: "TIME_TO_FIRST_BOOKING", segment: "PASSIONNE", libelle: "Time to first booking", unite: "jours", cible: 5, sens: "MOINS_EST_MIEUX" },
  { code: "RETENTION_M1", segment: "PASSIONNE", libelle: "Rétention M+1", unite: "%", cible: 70, sens: "PLUS_EST_MIEUX" },
  { code: "FREQUENCE_USAGE", segment: "PASSIONNE", libelle: "Fréquence d'usage", unite: "seances_mois", cible: 4, sens: "PLUS_EST_MIEUX" },
  { code: "CHURN_MENSUEL", segment: "PASSIONNE", libelle: "Churn mensuel", unite: "%", cible: 10, sens: "MOINS_EST_MIEUX" },
  { code: "NPS", segment: "PASSIONNE", libelle: "NPS", unite: "score", cible: 45, sens: "PLUS_EST_MIEUX" },
  // ----- Partenaires -----
  { code: "PROFIL_COMPLET", segment: "PARTENAIRE", libelle: "Profil complet", unite: "%", cible: 85, sens: "PLUS_EST_MIEUX" },
  { code: "TIME_TO_FIRST_RESERVATION", segment: "PARTENAIRE", libelle: "1ère réservation reçue", unite: "jours", cible: 14, sens: "MOINS_EST_MIEUX" },
  { code: "TAUX_REMPLISSAGE", segment: "PARTENAIRE", libelle: "Taux de remplissage créneaux", unite: "%", cible: 65, sens: "PLUS_EST_MIEUX" },
  { code: "RETENTION_6_MOIS", segment: "PARTENAIRE", libelle: "Rétention 6 mois", unite: "%", cible: 75, sens: "PLUS_EST_MIEUX" },
  { code: "RENOUVELLEMENT_CONTRAT", segment: "PARTENAIRE", libelle: "Renouvellement contrat", unite: "%", cible: 85, sens: "PLUS_EST_MIEUX" },
  { code: "NPS_PARTENAIRE", segment: "PARTENAIRE", libelle: "NPS partenaire", unite: "score", cible: 40, sens: "PLUS_EST_MIEUX" },
  // ----- Entreprises QVT -----
  { code: "ACTIVATION_COLLABORATEURS", segment: "ENTREPRISE_QVT", libelle: "Activation collaborateurs", unite: "%", cible: 50, sens: "PLUS_EST_MIEUX" },
  { code: "USAGE_MENSUEL_COLLABORATEUR", segment: "ENTREPRISE_QVT", libelle: "Usage / collaborateur / mois", unite: "seances_mois", cible: 2, sens: "PLUS_EST_MIEUX" },
  { code: "ADOPTION_CREDITS", segment: "ENTREPRISE_QVT", libelle: "Adoption crédits utilisés", unite: "%", cible: 70, sens: "PLUS_EST_MIEUX" },
  { code: "NPS_PROGRAMME_QVT", segment: "ENTREPRISE_QVT", libelle: "NPS programme QVT", unite: "score", cible: 40, sens: "PLUS_EST_MIEUX" },
  { code: "RENOUVELLEMENT_CONTRAT_QVT", segment: "ENTREPRISE_QVT", libelle: "Renouvellement contrat", unite: "%", cible: 80, sens: "PLUS_EST_MIEUX" },
  { code: "UPSELL_CORPORATE", segment: "ENTREPRISE_QVT", libelle: "Upsell corporate", unite: "%", cible: 20, sens: "PLUS_EST_MIEUX" },
];

const HISTORIQUE_MENSUEL: Record<string, number[]> = {
  TAUX_ACTIVATION: [42, 45, 48, 51, 55, 58],
  TIME_TO_FIRST_BOOKING: [7.5, 7, 6.5, 6, 5.5, 5.2],
  RETENTION_M1: [58, 60, 63, 65, 68, 71],
  FREQUENCE_USAGE: [2.8, 3.0, 3.2, 3.4, 3.6, 3.8],
  CHURN_MENSUEL: [14, 13, 12.5, 11.8, 11, 10.5],
  NPS: [38, 40, 41, 43, 44, 47],
  PROFIL_COMPLET: [70, 74, 78, 81, 84, 87],
  TIME_TO_FIRST_RESERVATION: [22, 20, 18, 16, 15, 13.5],
  TAUX_REMPLISSAGE: [48, 51, 54, 57, 60, 62],
  RETENTION_6_MOIS: [60, 62, 65, 68, 70, 72],
  RENOUVELLEMENT_CONTRAT: [76, 78, 79, 81, 83, 84],
  NPS_PARTENAIRE: [30, 32, 34, 36, 38, 41],
  ACTIVATION_COLLABORATEURS: [30, 34, 38, 42, 46, 49],
  USAGE_MENSUEL_COLLABORATEUR: [1.1, 1.3, 1.5, 1.7, 1.9, 2.1],
  ADOPTION_CREDITS: [45, 50, 55, 60, 65, 68],
  NPS_PROGRAMME_QVT: [25, 28, 31, 34, 37, 39],
  RENOUVELLEMENT_CONTRAT_QVT: [65, 68, 70, 73, 76, 78],
  UPSELL_CORPORATE: [8, 10, 12, 14, 16, 18],
};

export const mockKpiSnapshots: KpiSnapshotVM[] = KPI_DEFINITIONS.flatMap((def) =>
  HISTORIQUE_MENSUEL[def.code].map((valeur, i) => ({
    segment: def.segment,
    codeKpi: def.code,
    periode: MOIS[i],
    valeur,
  }))
);

// Cohortes de rétention — uniquement Passionnés et Partenaires (acquisition
// individuelle) ; une cohorte n'a d'observation que pour les mois déjà écoulés
// depuis son acquisition (ex. la cohorte de juillet n'a que M+0).
const COURBE_RETENTION_PCT: Record<"PASSIONNE" | "PARTENAIRE", number[]> = {
  PASSIONNE: [100, 68, 60, 55, 51, 48],
  PARTENAIRE: [100, 88, 82, 78, 76, 75],
};

const TAILLE_COHORTE: Record<"PASSIONNE" | "PARTENAIRE", number[]> = {
  PASSIONNE: [38, 45, 52, 61, 70, 44],
  PARTENAIRE: [3, 4, 3, 5, 4, 2],
};

export const mockCohortesRetention: CohorteRetentionVM[] = (
  ["PASSIONNE", "PARTENAIRE"] as const
).flatMap((segment) =>
  MOIS.flatMap((moisCohorte, cohorteIndex) => {
    const moisObservables = MOIS.length - cohorteIndex;
    return Array.from({ length: moisObservables }, (_, moisObservation) => ({
      segment: segment as Segment,
      moisCohorte,
      moisObservation,
      tailleInitiale: TAILLE_COHORTE[segment][cohorteIndex],
      pctRetenu: COURBE_RETENTION_PCT[segment][moisObservation],
    }));
  })
);

export function getKpiDefinitionsBySegment(segment: Segment): KpiDefinitionVM[] {
  return KPI_DEFINITIONS.filter((d) => d.segment === segment);
}

export function getKpiHistory(segment: Segment, codeKpi: string): KpiSnapshotVM[] {
  return mockKpiSnapshots
    .filter((s) => s.segment === segment && s.codeKpi === codeKpi)
    .sort((a, b) => (a.periode < b.periode ? -1 : 1));
}

export function getLatestKpiValue(segment: Segment, codeKpi: string): number | undefined {
  const historique = getKpiHistory(segment, codeKpi);
  return historique.at(-1)?.valeur;
}

export function estAlerte(valeur: number, cible: number, sens: SensAmelioration): boolean {
  return sens === "PLUS_EST_MIEUX" ? valeur < cible : valeur > cible;
}

export type AlerteKpiVM = {
  definition: KpiDefinitionVM;
  valeurActuelle: number;
  ecartPct: number; // écart relatif à la cible, en %
};

export function getAlertesActives(): AlerteKpiVM[] {
  return KPI_DEFINITIONS.flatMap((definition) => {
    const valeurActuelle = getLatestKpiValue(definition.segment, definition.code);
    if (valeurActuelle === undefined || !estAlerte(valeurActuelle, definition.cible, definition.sens)) {
      return [];
    }
    const ecartPct = ((valeurActuelle - definition.cible) / definition.cible) * 100;
    return [{ definition, valeurActuelle, ecartPct }];
  }).sort((a, b) => Math.abs(b.ecartPct) - Math.abs(a.ecartPct));
}

export function getCohortesBySegment(segment: "PASSIONNE" | "PARTENAIRE") {
  const moisCohortes = Array.from(new Set(mockCohortesRetention
    .filter((c) => c.segment === segment)
    .map((c) => c.moisCohorte)))
    .sort((a, b) => (a < b ? -1 : 1));

  return moisCohortes.map((moisCohorte) => ({
    moisCohorte,
    tailleInitiale: mockCohortesRetention.find(
      (c) => c.segment === segment && c.moisCohorte === moisCohorte
    )!.tailleInitiale,
    observations: mockCohortesRetention
      .filter((c) => c.segment === segment && c.moisCohorte === moisCohorte)
      .sort((a, b) => a.moisObservation - b.moisObservation),
  }));
}

export const NOMBRE_MOIS_OBSERVATION_MAX = MOIS.length - 1;
