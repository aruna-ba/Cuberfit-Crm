import type { CritereRisqueScore, Segment } from "@/generated/prisma/enums";

export type PonderationVM = {
  id: string;
  segment: Segment;
  critere: CritereRisqueScore;
  poidsPct: number;
};

/**
 * Pondérations par défaut du Score de risque, telles qu'actées dans la
 * stratégie Customer Success — explicitement "indicatives, à challenger
 * après la V0". Éditables sans redéploiement via /parametres/score-de-risque.
 * À remplacer par une vraie table `PonderationRisqueScore` une fois la base
 * Postgres branchée.
 */
export const defaultPonderations: PonderationVM[] = [
  { id: "pd_1", segment: "PASSIONNE", critere: "FREQUENCE_UTILISATION", poidsPct: 35 },
  { id: "pd_2", segment: "PASSIONNE", critere: "DERNIERE_ACTIVITE", poidsPct: 25 },
  { id: "pd_3", segment: "PASSIONNE", critere: "NPS_SATISFACTION", poidsPct: 20 },
  { id: "pd_4", segment: "PASSIONNE", critere: "NO_SHOW_ANNULATIONS", poidsPct: 10 },
  { id: "pd_5", segment: "PASSIONNE", critere: "TICKETS_OUVERTS", poidsPct: 10 },

  { id: "pd_6", segment: "PARTENAIRE", critere: "RESERVATIONS_VIA_CUBERFIT", poidsPct: 35 },
  { id: "pd_7", segment: "PARTENAIRE", critere: "TAUX_REMPLISSAGE_MOYEN", poidsPct: 25 },
  { id: "pd_8", segment: "PARTENAIRE", critere: "SATISFACTION_PARTENAIRE", poidsPct: 20 },
  { id: "pd_9", segment: "PARTENAIRE", critere: "ACTIVITE_COMPTE", poidsPct: 10 },
  { id: "pd_10", segment: "PARTENAIRE", critere: "TICKETS_OUVERTS", poidsPct: 10 },

  { id: "pd_11", segment: "ENTREPRISE_QVT", critere: "PCT_EMPLOYES_ACTIFS_MENSUELS", poidsPct: 30 },
  { id: "pd_12", segment: "ENTREPRISE_QVT", critere: "PCT_EMPLOYES_ACTIVES", poidsPct: 20 },
  { id: "pd_13", segment: "ENTREPRISE_QVT", critere: "TENDANCE_USAGE", poidsPct: 20 },
  { id: "pd_14", segment: "ENTREPRISE_QVT", critere: "BUDGET_CONSOMME", poidsPct: 15 },
  { id: "pd_15", segment: "ENTREPRISE_QVT", critere: "RENOUVELLEMENT_PROBABLE", poidsPct: 15 },
];

export const SEUILS_RISQUE_SCORE = {
  VERT: { min: 70, max: 100, action: "Fidéliser & proposer de l'upsell" },
  ORANGE: { min: 40, max: 69, action: "Contact préventif sous 7 jours" },
  ROUGE: { min: 0, max: 39, action: "Action immédiate" },
} as const;
