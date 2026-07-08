import type { Segment } from "@/generated/prisma/enums";
import type { EnqueteVM, ReponseEnqueteVM, CategorieNps } from "@/lib/types";

/**
 * Données de démonstration pour le module P1-3 (NPS & feedback).
 * Reprend le même schéma relationnel que Campagne/CampagneEnvoi (P0-4) :
 * une Enquete est une vague envoyée à un segment, une ReponseEnquete est la
 * réponse individuelle d'un compte (score 0-10 + verbatim optionnel).
 * À remplacer par de vraies requêtes Prisma une fois la base branchée.
 */
export const mockEnquetes: EnqueteVM[] = [
  {
    id: "enq_passionnes_juin",
    nom: "NPS Passionnés — Juin 2026",
    type: "NPS_RELATIONNEL",
    segmentCible: "PASSIONNE",
    dateEnvoi: "2026-06-15",
    reponses: [
      {
        id: "rep_1",
        enqueteId: "enq_passionnes_juin",
        accountId: "acc_passionne_1",
        accountNom: "Aïssatou Diop",
        segment: "PASSIONNE",
        score: 9,
        verbatim: "J'adore l'appli, toujours des créneaux dispo avec mon coach.",
        statutTraitement: "TRAITE",
        dateReponse: "2026-06-16",
      },
      {
        id: "rep_2",
        enqueteId: "enq_passionnes_juin",
        accountId: "acc_passionne_2",
        accountNom: "Ibrahima Ndiaye",
        segment: "PASSIONNE",
        score: 3,
        verbatim: "Je n'arrive plus à réserver mes séances habituelles, très frustrant.",
        statutTraitement: "NOUVEAU",
        dateReponse: "2026-06-17",
      },
      {
        id: "rep_3",
        enqueteId: "enq_passionnes_juin",
        accountId: "acc_passionne_3",
        accountNom: "Moussa Diagne",
        segment: "PASSIONNE",
        score: 6,
        verbatim: "Moins actif ces dernières semaines, je verrais bien plus d'options le soir.",
        statutTraitement: "EN_COURS",
        dateReponse: "2026-06-18",
      },
    ],
  },
  {
    id: "enq_partenaires_juin",
    nom: "NPS Partenaires — Juin 2026",
    type: "NPS_RELATIONNEL",
    segmentCible: "PARTENAIRE",
    dateEnvoi: "2026-06-20",
    reponses: [
      {
        id: "rep_4",
        enqueteId: "enq_partenaires_juin",
        accountId: "acc_partenaire_1",
        accountNom: "Dakar Fitness Club",
        segment: "PARTENAIRE",
        score: 8,
        verbatim: "Bon partenariat, on aimerait plus de visibilité dans l'app.",
        statutTraitement: "EN_COURS",
        dateReponse: "2026-06-21",
      },
      {
        id: "rep_5",
        enqueteId: "enq_partenaires_juin",
        accountId: "acc_partenaire_2",
        accountNom: "Coach Moussa Fall",
        segment: "PARTENAIRE",
        score: 9,
        statutTraitement: "TRAITE",
        dateReponse: "2026-06-22",
      },
      {
        id: "rep_6",
        enqueteId: "enq_partenaires_juin",
        accountId: "acc_partenaire_ambassadeur_1",
        accountNom: "Studio Pilates Sacré-Cœur",
        segment: "PARTENAIRE",
        score: 10,
        verbatim: "Meilleur partenariat que nous ayons, le programme ambassadeur nous booste.",
        statutTraitement: "TRAITE",
        dateReponse: "2026-06-23",
      },
    ],
  },
  {
    id: "enq_qvt_mai",
    nom: "NPS Entreprises QVT — Mai 2026",
    type: "NPS_RELATIONNEL",
    segmentCible: "ENTREPRISE_QVT",
    dateEnvoi: "2026-05-28",
    reponses: [
      {
        id: "rep_7",
        enqueteId: "enq_qvt_mai",
        accountId: "acc_entreprise_1",
        accountNom: "Sonatel",
        segment: "ENTREPRISE_QVT",
        score: 7,
        verbatim: "Bon programme mais l'adoption reste timide côté collaborateurs.",
        statutTraitement: "EN_COURS",
        dateReponse: "2026-05-30",
      },
      {
        id: "rep_8",
        enqueteId: "enq_qvt_mai",
        accountId: "acc_entreprise_2",
        accountNom: "Teranga Assurances",
        segment: "ENTREPRISE_QVT",
        score: 4,
        verbatim: "Le reporting mensuel arrive trop tard pour qu'on puisse agir avec les RH.",
        statutTraitement: "NOUVEAU",
        dateReponse: "2026-05-31",
      },
    ],
  },
  {
    id: "enq_partenaires_onboarding",
    nom: "NPS Transactionnel — Post-onboarding Partenaires",
    type: "NPS_TRANSACTIONNEL",
    segmentCible: "PARTENAIRE",
    dateEnvoi: "2026-07-02",
    reponses: [
      {
        id: "rep_9",
        enqueteId: "enq_partenaires_onboarding",
        accountId: "acc_partenaire_1",
        accountNom: "Dakar Fitness Club",
        segment: "PARTENAIRE",
        score: 9,
        verbatim: "Kick-off très clair, on était opérationnels en une semaine.",
        statutTraitement: "TRAITE",
        dateReponse: "2026-07-03",
      },
    ],
  },
];

export function getAllReponses(): ReponseEnqueteVM[] {
  return mockEnquetes.flatMap((e) => e.reponses);
}

export function categoriserScore(score: number): CategorieNps {
  if (score >= 9) return "PROMOTEUR";
  if (score >= 7) return "PASSIF";
  return "DETRACTEUR";
}

export type NpsSegmentSummary = {
  nps: number;
  nombreReponses: number;
  promoteurs: number;
  passifs: number;
  detracteurs: number;
};

export function calculerNps(reponses: ReponseEnqueteVM[]): NpsSegmentSummary | undefined {
  if (reponses.length === 0) return undefined;
  const promoteurs = reponses.filter((r) => categoriserScore(r.score) === "PROMOTEUR").length;
  const passifs = reponses.filter((r) => categoriserScore(r.score) === "PASSIF").length;
  const detracteurs = reponses.filter((r) => categoriserScore(r.score) === "DETRACTEUR").length;
  const nps = Math.round(((promoteurs - detracteurs) / reponses.length) * 100);
  return { nps, nombreReponses: reponses.length, promoteurs, passifs, detracteurs };
}

export function getNpsParSegment(segment: Segment): NpsSegmentSummary | undefined {
  return calculerNps(getAllReponses().filter((r) => r.segment === segment));
}

export function getReponsesByAccountId(accountId: string): ReponseEnqueteVM[] {
  return getAllReponses()
    .filter((r) => r.accountId === accountId)
    .sort((a, b) => (a.dateReponse < b.dateReponse ? 1 : -1));
}

export function getVerbatimsNonTraites(): ReponseEnqueteVM[] {
  return getAllReponses().filter((r) => r.verbatim && r.statutTraitement === "NOUVEAU");
}
