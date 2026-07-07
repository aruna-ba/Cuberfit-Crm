import type { CampagneVM, TemplateVM } from "@/lib/types";

/**
 * Données de démonstration pour le module P0-4 (Communication multicanale).
 * À remplacer par de vraies requêtes Prisma une fois la base Postgres branchée.
 */
export const mockTemplates: TemplateVM[] = [
  {
    id: "tpl_1",
    nom: "Bienvenue — Onboarding Passionné",
    canal: "EMAIL",
    segment: "PASSIONNE",
    phase: "ONBOARDING",
    sujet: "Bienvenue chez Cuberfit, {{prenom}} 🎉",
    corps:
      "Salut {{prenom}}, bienvenue chez Cuberfit ! Réserve ta première séance et commence à cumuler des points dès aujourd'hui.",
    actif: true,
  },
  {
    id: "tpl_2",
    nom: "Relance J+7 — Onboarding Passionné",
    canal: "WHATSAPP",
    segment: "PASSIONNE",
    phase: "ONBOARDING",
    corps: "Hello {{prenom}} 👋 Tu n'as pas encore réservé ta première séance — besoin d'un coup de main ?",
    actif: true,
  },
  {
    id: "tpl_3",
    nom: "Kit de communication — Onboarding QVT",
    canal: "EMAIL",
    segment: "ENTREPRISE_QVT",
    phase: "ONBOARDING",
    sujet: "Le kit de lancement Cuberfit pour vos collaborateurs",
    corps:
      "Bonjour {{prenom}}, voici le kit de communication à partager avec vos collaborateurs pour le lancement de Cuberfit.",
    actif: true,
  },
  {
    id: "tpl_4",
    nom: "Relance inactivité — Client silencieux",
    canal: "WHATSAPP",
    segment: "PASSIONNE",
    corps: "On ne t'a pas vu depuis un moment, {{prenom}} — tout va bien ? Dis-nous si on peut t'aider.",
    actif: true,
  },
  {
    id: "tpl_5",
    nom: "Newsletter mensuelle — Adoption",
    canal: "EMAIL",
    segment: "PASSIONNE",
    phase: "ADOPTION",
    sujet: "Tes nouveautés Cuberfit du mois",
    corps: "Salut {{prenom}}, découvre les nouvelles activités et défis du mois sur Cuberfit.",
    actif: true,
  },
];

export const mockCampagnes: CampagneVM[] = [
  {
    id: "camp_1",
    nom: "Relance onboarding J+7 — Juin",
    description: "Relance automatique des Passionnés inscrits sans première réservation à J+7.",
    segmentCible: "PASSIONNE",
    phaseCible: "ONBOARDING",
    canal: "WHATSAPP",
    templateId: "tpl_2",
    templateNom: "Relance J+7 — Onboarding Passionné",
    statut: "TERMINEE",
    dateEnvoi: "2026-06-20",
    dateCreation: "2026-06-19",
    envois: [
      { id: "env_1", accountId: "acc_passionne_1", accountNom: "Aïssatou Diop", statut: "LU", dateEnvoi: "2026-06-20", dateLecture: "2026-06-20" },
      { id: "env_2", accountId: "acc_passionne_2", accountNom: "Ibrahima Ndiaye", statut: "LIVRE", dateEnvoi: "2026-06-20" },
      { id: "env_3", accountId: "acc_passionne_3", accountNom: "Moussa Diagne", statut: "ECHEC", dateEnvoi: "2026-06-20" },
    ],
  },
  {
    id: "camp_2",
    nom: "Newsletter Adoption — Juillet",
    description: "Newsletter mensuelle envoyée à tous les Passionnés en phase Adoption.",
    segmentCible: "PASSIONNE",
    phaseCible: "ADOPTION",
    canal: "EMAIL",
    templateId: "tpl_5",
    templateNom: "Newsletter mensuelle — Adoption",
    statut: "ENVOYEE",
    dateEnvoi: "2026-07-01",
    dateCreation: "2026-06-28",
    envois: [
      { id: "env_4", accountId: "acc_passionne_1", accountNom: "Aïssatou Diop", statut: "LU", dateEnvoi: "2026-07-01", dateLecture: "2026-07-02" },
      { id: "env_5", accountId: "acc_passionne_3", accountNom: "Moussa Diagne", statut: "ENVOYE", dateEnvoi: "2026-07-01" },
    ],
  },
  {
    id: "camp_3",
    nom: "Kit onboarding QVT — Teranga Assurances",
    description: "Envoi du kit de communication au lancement du programme QVT.",
    segmentCible: "ENTREPRISE_QVT",
    phaseCible: "ONBOARDING",
    canal: "EMAIL",
    templateId: "tpl_3",
    templateNom: "Kit de communication — Onboarding QVT",
    statut: "TERMINEE",
    dateEnvoi: "2026-06-04",
    dateCreation: "2026-06-03",
    envois: [
      { id: "env_6", accountId: "acc_entreprise_2", accountNom: "Teranga Assurances", statut: "LU", dateEnvoi: "2026-06-04", dateLecture: "2026-06-05" },
    ],
  },
  {
    id: "camp_4",
    nom: "Rentrée sportive — Septembre",
    description: "Campagne de relance tous segments pour la rentrée.",
    canal: "EMAIL",
    templateId: "tpl_5",
    templateNom: "Newsletter mensuelle — Adoption",
    statut: "BROUILLON",
    datePlanifiee: "2026-09-01",
    dateCreation: "2026-07-05",
    envois: [],
  },
];

export function getCampagneById(id: string): CampagneVM | undefined {
  return mockCampagnes.find((c) => c.id === id);
}
