import type { AccountVM } from "@/lib/types";

/**
 * Données de démonstration pour la maquette des écrans P0-1.
 * À remplacer par de vraies requêtes Prisma une fois le schéma validé
 * avec Awa et Fatou Sakho et une base Postgres branchée.
 */
export const mockAccounts: AccountVM[] = [
  {
    id: "acc_passionne_1",
    segment: "PASSIONNE",
    nom: "Aïssatou Diop",
    niveauAccompagnement: "TECH_TOUCH",
    phaseLifecycle: "ADOPTION",
    healthScoreActuel: 82,
    healthScoreStatut: "VERT",
    csmAssigne: "Fatou Sakho",
    dateCreation: "2026-02-10",
    contacts: [],
    passionneProfile: {
      email: "aissatou.diop@example.sn",
      telephone: "+221 77 123 45 67",
      ville: "Dakar",
      statutAbonnement: "ACCESS",
      creditsAchetes: 120,
      creditsConsommes: 96,
      creditsDormants: 8,
      nombreNoShow: 1,
      nombreAnnulations: 2,
      npsScore: 62,
      dateDerniereActivite: "2026-07-01",
      coachsAssocies: [{ id: "acc_partenaire_2", nom: "Coach Moussa Fall" }],
    },
    interactions: [
      { id: "int_1", type: "ACHAT", titre: "Achat pack 20 crédits", dateInteraction: "2026-06-15", creePar: "App Access" },
      { id: "int_2", type: "APPEL_AGENT_VOCAL", titre: "Question sur crédits dormants", dateInteraction: "2026-06-20", creePar: "Agent vocal ElevenLabs" },
      { id: "int_3", type: "CAMPAGNE", titre: "Campagne relance J+7 onboarding", dateInteraction: "2026-02-17", creePar: "N8N" },
    ],
    healthScoreHistorique: [
      { id: "hs_1", score: 74, statut: "ORANGE", dateCalcul: "2026-05-01", detailCriteres: [] },
      { id: "hs_2", score: 82, statut: "VERT", dateCalcul: "2026-07-01", detailCriteres: [
        { critere: "Fréquence d'utilisation", poidsPct: 35, valeur: "5 séances/mois" },
        { critere: "Dernière activité / récence", poidsPct: 25, valeur: "il y a 2 jours" },
        { critere: "NPS / satisfaction", poidsPct: 20, valeur: "62" },
        { critere: "No-show & annulations", poidsPct: 10, valeur: "1 no-show, 2 annulations" },
        { critere: "Tickets ouverts", poidsPct: 10, valeur: "0" },
      ] },
    ],
    momentsDeVerite: [
      { id: "mv_1", type: "PREMIERE_SESSION_REUSSIE", dateCibleAvant: "2026-02-24", dateAtteint: "2026-02-15" },
    ],
    playbookExecutions: [
      {
        id: "pe_1",
        playbookNom: "Onboarding Passionné",
        statut: "TERMINEE",
        dateDeclenchement: "2026-02-10",
        etapes: [
          { id: "ee_1", ordre: 1, titre: "Tutoriel de bienvenue", typeAction: "NOTIFICATION_INTERNE", canal: "AUCUN", statut: "FAITE", dateEcheance: "2026-02-10", dateRealisation: "2026-02-10" },
          { id: "ee_2", ordre: 2, titre: "Relance J+3", typeAction: "RELANCE_AUTO", canal: "EMAIL", statut: "FAITE", dateEcheance: "2026-02-13", dateRealisation: "2026-02-13" },
          { id: "ee_3", ordre: 3, titre: "Relance J+7", typeAction: "RELANCE_AUTO", canal: "WHATSAPP", statut: "FAITE", dateEcheance: "2026-02-17", dateRealisation: "2026-02-17" },
        ],
      },
    ],
  },
  {
    id: "acc_passionne_2",
    segment: "PASSIONNE",
    nom: "Ibrahima Ndiaye",
    niveauAccompagnement: "TECH_TOUCH",
    phaseLifecycle: "A_RISQUE",
    healthScoreActuel: 34,
    healthScoreStatut: "ROUGE",
    csmAssigne: "Fatou Sakho",
    dateCreation: "2026-03-02",
    contacts: [],
    passionneProfile: {
      email: "ibrahima.ndiaye@example.sn",
      telephone: "+221 76 987 65 43",
      ville: "Dakar",
      statutAbonnement: "ACCESS",
      creditsAchetes: 40,
      creditsConsommes: 12,
      creditsDormants: 28,
      nombreNoShow: 4,
      nombreAnnulations: 3,
      npsScore: 10,
      dateDerniereActivite: "2026-06-05",
      coachsAssocies: [],
    },
    interactions: [
      { id: "int_4", type: "TICKET", titre: "Réclamation : séance annulée sans remboursement", dateInteraction: "2026-06-18", creePar: "Agent vocal ElevenLabs" },
    ],
    healthScoreHistorique: [
      { id: "hs_3", score: 58, statut: "ORANGE", dateCalcul: "2026-05-01", detailCriteres: [] },
      { id: "hs_4", score: 34, statut: "ROUGE", dateCalcul: "2026-07-01", detailCriteres: [] },
    ],
    momentsDeVerite: [
      { id: "mv_2", type: "PREMIERE_SESSION_REUSSIE", dateCibleAvant: "2026-03-16", dateAtteint: "2026-03-08" },
    ],
    playbookExecutions: [
      {
        id: "pe_2",
        playbookNom: "Client à risque",
        statut: "EN_COURS",
        dateDeclenchement: "2026-06-18",
        etapes: [
          { id: "ee_4", ordre: 1, titre: "Notifier le CSM du signal négatif", typeAction: "NOTIFICATION_INTERNE", canal: "AUCUN", statut: "FAITE", dateEcheance: "2026-06-18", dateRealisation: "2026-06-18" },
          { id: "ee_5", ordre: 2, titre: "Appel de suivi personnalisé", typeAction: "TACHE_MANUELLE", canal: "APPEL", statut: "A_FAIRE", dateEcheance: "2026-07-09", assigneA: "Fatou Sakho" },
        ],
      },
    ],
  },
  {
    id: "acc_passionne_3",
    segment: "PASSIONNE",
    nom: "Moussa Diagne",
    niveauAccompagnement: "TECH_TOUCH",
    phaseLifecycle: "ADOPTION",
    healthScoreActuel: 51,
    healthScoreStatut: "ORANGE",
    csmAssigne: "Fatou Sakho",
    dateCreation: "2026-04-05",
    contacts: [],
    passionneProfile: {
      email: "moussa.diagne@example.sn",
      telephone: "+221 78 456 12 90",
      ville: "Dakar",
      statutAbonnement: "ACCESS",
      creditsAchetes: 60,
      creditsConsommes: 45,
      creditsDormants: 15,
      nombreNoShow: 0,
      nombreAnnulations: 1,
      npsScore: 40,
      dateDerniereActivite: "2026-06-12",
      coachsAssocies: [],
    },
    interactions: [
      { id: "int_9", type: "ACHAT", titre: "Achat pack 10 crédits", dateInteraction: "2026-05-20", creePar: "App Access" },
    ],
    healthScoreHistorique: [
      { id: "hs_11", score: 66, statut: "ORANGE", dateCalcul: "2026-06-01", detailCriteres: [] },
      { id: "hs_12", score: 51, statut: "ORANGE", dateCalcul: "2026-07-01", detailCriteres: [] },
    ],
    momentsDeVerite: [
      { id: "mv_3", type: "PREMIERE_SESSION_REUSSIE", dateCibleAvant: "2026-04-19", dateAtteint: "2026-04-11" },
    ],
    playbookExecutions: [
      {
        id: "pe_3",
        playbookNom: "Client silencieux",
        statut: "EN_COURS",
        dateDeclenchement: "2026-07-02",
        etapes: [
          { id: "ee_6", ordre: 1, titre: "Relance automatique inactivité (>14j)", typeAction: "RELANCE_AUTO", canal: "WHATSAPP", statut: "A_FAIRE", dateEcheance: "2026-07-07" },
        ],
      },
    ],
  },
  {
    id: "acc_partenaire_1",
    segment: "PARTENAIRE",
    nom: "Dakar Fitness Club",
    niveauAccompagnement: "HIGH_TOUCH",
    phaseLifecycle: "EXPANSION",
    healthScoreActuel: 76,
    healthScoreStatut: "VERT",
    csmAssigne: "Marieme Mbaye",
    dateCreation: "2025-11-20",
    contacts: [
      { id: "c_1", prenom: "Cheikh", nom: "Sarr", email: "cheikh.sarr@dakarfitness.sn", telephone: "+221 78 111 22 33", role: "Gérant", estContactPrincipal: true },
    ],
    partenaireProfile: {
      typeActivite: "SALLE",
      ville: "Dakar",
      adresse: "Route de Ouakam, Dakar",
      statutProfilCompletudePct: 95,
      tauxRemplissageMoyenPct: 71,
      reservationsRecuesTotal: 842,
      satisfactionScore: 8,
      dateSignature: "2025-11-20",
    },
    interactions: [
      { id: "int_5", type: "NOTE", titre: "Point trimestriel Q2 réalisé", dateInteraction: "2026-06-10", creePar: "Marieme Mbaye" },
    ],
    healthScoreHistorique: [
      { id: "hs_5", score: 68, statut: "ORANGE", dateCalcul: "2026-04-01", detailCriteres: [] },
      { id: "hs_6", score: 76, statut: "VERT", dateCalcul: "2026-07-01", detailCriteres: [] },
    ],
    momentsDeVerite: [
      { id: "mv_4", type: "PREMIERE_RESERVATION", dateCibleAvant: "2025-12-04", dateAtteint: "2025-11-27" },
    ],
    playbookExecutions: [],
  },
  {
    id: "acc_partenaire_2",
    segment: "PARTENAIRE",
    nom: "Coach Moussa Fall",
    niveauAccompagnement: "LOW_TOUCH",
    phaseLifecycle: "ADOPTION",
    healthScoreActuel: 55,
    healthScoreStatut: "ORANGE",
    csmAssigne: "Marieme Mbaye",
    dateCreation: "2026-01-15",
    contacts: [],
    partenaireProfile: {
      typeActivite: "COACH_INDEPENDANT",
      ville: "Dakar",
      statutProfilCompletudePct: 60,
      tauxRemplissageMoyenPct: 40,
      reservationsRecuesTotal: 63,
      satisfactionScore: 7,
      dateSignature: "2026-01-15",
    },
    interactions: [],
    healthScoreHistorique: [
      { id: "hs_7", score: 55, statut: "ORANGE", dateCalcul: "2026-07-01", detailCriteres: [] },
    ],
    momentsDeVerite: [
      { id: "mv_5", type: "PREMIERE_RESERVATION", dateCibleAvant: "2026-01-29", dateAtteint: "2026-01-22" },
    ],
    playbookExecutions: [],
  },
  {
    id: "acc_entreprise_1",
    segment: "ENTREPRISE_QVT",
    nom: "Sonatel",
    niveauAccompagnement: "HIGH_TOUCH",
    phaseLifecycle: "EXPANSION",
    healthScoreActuel: 88,
    healthScoreStatut: "VERT",
    csmAssigne: "Harouna Ba",
    dateCreation: "2025-09-01",
    contacts: [
      { id: "c_2", prenom: "Fatoumata", nom: "Cissé", email: "f.cisse@sonatel.sn", telephone: "+221 33 859 00 00", role: "Interlocuteur RH", estContactPrincipal: true },
    ],
    entrepriseQvtProfile: {
      secteurActivite: "Télécommunications",
      tailleEffectif: 1800,
      budgetAllouAnnuel: 18000,
      budgetConsommeAnnuel: 12400,
      pctEmployesActives: 64,
      pctEmployesActifsMensuels: 48,
      dateSignature: "2025-09-01",
      dateRenouvellement: "2026-09-01",
    },
    interactions: [
      { id: "int_6", type: "NOTE", titre: "Revue DRH semestrielle", dateInteraction: "2026-06-01", creePar: "Harouna Ba" },
      { id: "int_7", type: "CAMPAGNE", titre: "Campagne interne relance collaborateurs inactifs", dateInteraction: "2026-05-15", creePar: "N8N" },
    ],
    healthScoreHistorique: [
      { id: "hs_8", score: 81, statut: "VERT", dateCalcul: "2026-04-01", detailCriteres: [] },
      { id: "hs_9", score: 88, statut: "VERT", dateCalcul: "2026-07-01", detailCriteres: [] },
    ],
    momentsDeVerite: [
      { id: "mv_6", type: "PREMIER_REPORTING_QVT_POSITIF", dateCibleAvant: "2025-09-15", dateAtteint: "2025-09-10" },
    ],
    playbookExecutions: [],
  },
  {
    id: "acc_entreprise_2",
    segment: "ENTREPRISE_QVT",
    nom: "Teranga Assurances",
    niveauAccompagnement: "LOW_TOUCH",
    phaseLifecycle: "ONBOARDING",
    healthScoreActuel: 45,
    healthScoreStatut: "ORANGE",
    csmAssigne: "Harouna Ba",
    dateCreation: "2026-06-01",
    contacts: [
      { id: "c_3", prenom: "Abdou", nom: "Diallo", email: "a.diallo@teranga-assurances.sn", telephone: "+221 33 822 11 11", role: "Interlocuteur RH", estContactPrincipal: true },
    ],
    entrepriseQvtProfile: {
      secteurActivite: "Assurance",
      tailleEffectif: 220,
      budgetAllouAnnuel: 4000,
      budgetConsommeAnnuel: 600,
      pctEmployesActives: 22,
      pctEmployesActifsMensuels: 15,
      dateSignature: "2026-06-01",
      dateRenouvellement: "2027-06-01",
    },
    interactions: [
      { id: "int_8", type: "NOTE", titre: "Kick-off onboarding + webinaire employés planifié", dateInteraction: "2026-06-05", creePar: "Harouna Ba" },
    ],
    healthScoreHistorique: [
      { id: "hs_10", score: 45, statut: "ORANGE", dateCalcul: "2026-07-01", detailCriteres: [] },
    ],
    momentsDeVerite: [
      { id: "mv_7", type: "PREMIER_REPORTING_QVT_POSITIF", dateCibleAvant: "2026-06-15" },
    ],
    playbookExecutions: [
      {
        id: "pe_4",
        playbookNom: "Onboarding Entreprise QVT",
        statut: "EN_COURS",
        dateDeclenchement: "2026-06-01",
        etapes: [
          { id: "ee_7", ordre: 1, titre: "Réunion DRH de lancement", typeAction: "TACHE_MANUELLE", canal: "APPEL", statut: "FAITE", dateEcheance: "2026-06-01", dateRealisation: "2026-06-01", assigneA: "Harouna Ba" },
          { id: "ee_8", ordre: 2, titre: "Envoi du kit de communication", typeAction: "RELANCE_AUTO", canal: "EMAIL", statut: "FAITE", dateEcheance: "2026-06-03", dateRealisation: "2026-06-04" },
          { id: "ee_9", ordre: 3, titre: "Webinaire employés", typeAction: "TACHE_MANUELLE", canal: "APPEL", statut: "A_FAIRE", dateEcheance: "2026-07-10", assigneA: "Harouna Ba" },
          { id: "ee_10", ordre: 4, titre: "Invitations automatiques aux non-inscrits", typeAction: "RELANCE_AUTO", canal: "EMAIL", statut: "A_FAIRE", dateEcheance: "2026-07-12" },
        ],
      },
    ],
  },
];

export function getAccountById(id: string): AccountVM | undefined {
  return mockAccounts.find((a) => a.id === id);
}
