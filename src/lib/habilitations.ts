import type { RoleUtilisateur, Segment } from "@/generated/prisma/enums";

export type HabilitationVM = {
  id: string;
  role: RoleUtilisateur;
  segment: Segment;
  autorise: boolean;
};

/**
 * Cloisonnement par segment par défaut, tel qu'implicite dans le prompt de
 * cadrage (section 4) : "CSM Partenaires" ne voit que les Partenaires,
 * "Sales/BizDev" et "CSM Entreprises QVT" (devenus Sales Corporate / Account
 * Manager après la réconciliation P1-1) ne voient que les Entreprises QVT.
 * Éditable sans redéploiement via /parametres/habilitations, comme les
 * pondérations du Score de risque. À remplacer par la table
 * `HabilitationSegment` une fois la base Postgres branchée.
 */
export const defaultHabilitations: HabilitationVM[] = [
  { id: "hab_1", role: "ADMIN", segment: "PASSIONNE", autorise: true },
  { id: "hab_2", role: "ADMIN", segment: "PARTENAIRE", autorise: true },
  { id: "hab_3", role: "ADMIN", segment: "ENTREPRISE_QVT", autorise: true },

  { id: "hab_4", role: "ACTIVATION_MANAGER", segment: "PASSIONNE", autorise: false },
  { id: "hab_5", role: "ACTIVATION_MANAGER", segment: "PARTENAIRE", autorise: true },
  { id: "hab_6", role: "ACTIVATION_MANAGER", segment: "ENTREPRISE_QVT", autorise: false },

  { id: "hab_7", role: "SALES_CORPORATE", segment: "PASSIONNE", autorise: false },
  { id: "hab_8", role: "SALES_CORPORATE", segment: "PARTENAIRE", autorise: false },
  { id: "hab_9", role: "SALES_CORPORATE", segment: "ENTREPRISE_QVT", autorise: true },

  { id: "hab_10", role: "ACCOUNT_MANAGER", segment: "PASSIONNE", autorise: false },
  { id: "hab_11", role: "ACCOUNT_MANAGER", segment: "PARTENAIRE", autorise: false },
  { id: "hab_12", role: "ACCOUNT_MANAGER", segment: "ENTREPRISE_QVT", autorise: true },

  // Le support gère les tickets des 3 segments (voir P0-5 — les tickets
  // existants couvrent Passionnés, Partenaires et Entreprises QVT), même si
  // le prompt source le nomme "CS Ops/Support Passionnés".
  { id: "hab_13", role: "CS_OPS_SUPPORT", segment: "PASSIONNE", autorise: true },
  { id: "hab_14", role: "CS_OPS_SUPPORT", segment: "PARTENAIRE", autorise: true },
  { id: "hab_15", role: "CS_OPS_SUPPORT", segment: "ENTREPRISE_QVT", autorise: true },

  // Investisseurs/reporting direction — vue agrégée de tous les segments,
  // sans droit d'édition (garanti ailleurs, pas par ce module).
  { id: "hab_16", role: "LECTURE_SEULE", segment: "PASSIONNE", autorise: true },
  { id: "hab_17", role: "LECTURE_SEULE", segment: "PARTENAIRE", autorise: true },
  { id: "hab_18", role: "LECTURE_SEULE", segment: "ENTREPRISE_QVT", autorise: true },
];

export function getSegmentsAutorises(
  role: RoleUtilisateur,
  habilitations: HabilitationVM[] = defaultHabilitations
): Segment[] {
  return habilitations.filter((h) => h.role === role && h.autorise).map((h) => h.segment);
}
