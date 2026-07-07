import type {
  Segment,
  NiveauAccompagnement,
  PhaseLifecycle,
  StatutRisqueScore,
  StatutAbonnement,
  TypeActivitePartenaire,
  TypeInteraction,
  TypeMomentDeVerite,
  StatutEtapePlaybook,
  StatutPlaybookExecution,
  TypeActionEtape,
  CanalCommunication,
  CritereRisqueScore,
  StatutCampagne,
  StatutEnvoiCampagne,
  CanalEntreeTicket,
  PrioriteTicket,
  StatutTicket,
  OrigineTicket,
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

export const statutRisqueScoreLabel: Record<StatutRisqueScore, string> = {
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
  RISQUE_SCORE_CHANGE: "Évolution Score de risque",
  NOTE: "Note",
};

export const risqueScoreBadgeClass: Record<StatutRisqueScore, string> = {
  VERT: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  ORANGE: "bg-amber-100 text-amber-800 ring-amber-600/20",
  ROUGE: "bg-red-100 text-red-800 ring-red-600/20",
};

export const niveauAccompagnementBadgeClass: Record<NiveauAccompagnement, string> = {
  TECH_TOUCH: "bg-sky-100 text-sky-800 ring-sky-600/20",
  LOW_TOUCH: "bg-slate-100 text-slate-700 ring-slate-600/20",
  HIGH_TOUCH: "bg-violet-100 text-violet-800 ring-violet-600/20",
};

// ---------------------------------------------------------------------------
// Module P0-2 — Onboarding & lifecycle
// ---------------------------------------------------------------------------

/// Objectif de chaque phase, tel qu'acté dans la stratégie CS — affiché en
/// sous-titre des colonnes de la Vue onboarding/lifecycle par phase.
export const phaseLifecycleObjectif: Record<PhaseLifecycle, string> = {
  ONBOARDING: "1ère expérience réussie en 7-14 jours",
  ADOPTION: "Ancrer l'usage régulier",
  EXPANSION: "Upsell, renouvellement, extension",
  A_RISQUE: "Prévenir le churn — action sous 7 jours",
  CHURN: "Compte perdu ou parti",
};

export const phaseLifecycleBadgeClass: Record<PhaseLifecycle, string> = {
  ONBOARDING: "bg-sky-100 text-sky-800 ring-sky-600/20",
  ADOPTION: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  EXPANSION: "bg-violet-100 text-violet-800 ring-violet-600/20",
  A_RISQUE: "bg-amber-100 text-amber-800 ring-amber-600/20",
  CHURN: "bg-red-100 text-red-800 ring-red-600/20",
};

export const typeMomentDeVeriteLabel: Record<TypeMomentDeVerite, string> = {
  PREMIERE_SESSION_REUSSIE: "1ère session réussie",
  PREMIERE_RESERVATION: "1ère réservation reçue",
  PREMIER_REPORTING_QVT_POSITIF: "1er reporting QVT positif",
};

export const statutEtapePlaybookLabel: Record<StatutEtapePlaybook, string> = {
  A_FAIRE: "À faire",
  FAITE: "Faite",
  IGNOREE: "Ignorée",
};

export const statutPlaybookExecutionLabel: Record<StatutPlaybookExecution, string> = {
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export const typeActionEtapeLabel: Record<TypeActionEtape, string> = {
  RELANCE_AUTO: "Relance automatique",
  TACHE_MANUELLE: "Tâche manuelle",
  NOTIFICATION_INTERNE: "Notification interne",
};

export const canalCommunicationLabel: Record<CanalCommunication, string> = {
  EMAIL: "Email",
  SMS: "SMS",
  WHATSAPP: "WhatsApp",
  APPEL: "Appel",
  AUCUN: "—",
};

// ---------------------------------------------------------------------------
// Module P0-3 — Score de risque & churn
// ---------------------------------------------------------------------------

export const critereRisqueScoreLabel: Record<CritereRisqueScore, string> = {
  FREQUENCE_UTILISATION: "Fréquence d'utilisation",
  DERNIERE_ACTIVITE: "Dernière activité / récence",
  NPS_SATISFACTION: "NPS / satisfaction",
  NO_SHOW_ANNULATIONS: "No-show & annulations",
  RESERVATIONS_VIA_CUBERFIT: "Réservations via Cuberfit",
  TAUX_REMPLISSAGE_MOYEN: "Taux de remplissage moyen",
  SATISFACTION_PARTENAIRE: "Satisfaction partenaire",
  ACTIVITE_COMPTE: "Activité du compte",
  TICKETS_OUVERTS: "Tickets ouverts",
  PCT_EMPLOYES_ACTIFS_MENSUELS: "% employés actifs mensuels",
  PCT_EMPLOYES_ACTIVES: "% employés activés",
  TENDANCE_USAGE: "Tendance d'usage",
  BUDGET_CONSOMME: "Budget consommé",
  RENOUVELLEMENT_PROBABLE: "Renouvellement probable",
};

// ---------------------------------------------------------------------------
// Module P0-4 — Communication multicanale
// ---------------------------------------------------------------------------

export const statutCampagneLabel: Record<StatutCampagne, string> = {
  BROUILLON: "Brouillon",
  PLANIFIEE: "Planifiée",
  ENVOYEE: "Envoyée",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export const statutCampagneBadgeClass: Record<StatutCampagne, string> = {
  BROUILLON: "bg-slate-100 text-slate-600 ring-slate-600/20",
  PLANIFIEE: "bg-sky-100 text-sky-800 ring-sky-600/20",
  ENVOYEE: "bg-violet-100 text-violet-800 ring-violet-600/20",
  TERMINEE: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  ANNULEE: "bg-red-100 text-red-800 ring-red-600/20",
};

export const statutEnvoiCampagneLabel: Record<StatutEnvoiCampagne, string> = {
  EN_ATTENTE: "En attente",
  ENVOYE: "Envoyé",
  LIVRE: "Livré",
  LU: "Lu",
  CLIQUE: "Cliqué",
  ECHEC: "Échec",
};

// ---------------------------------------------------------------------------
// Module P0-5 — Tickets & support
// ---------------------------------------------------------------------------

export const canalEntreeTicketLabel: Record<CanalEntreeTicket, string> = {
  APP_MOBILE: "App mobile",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  AGENT_VOCAL: "Agent vocal (RVI)",
  APPEL_TELEPHONIQUE: "Appel téléphonique",
};

export const prioriteTicketLabel: Record<PrioriteTicket, string> = {
  URGENTE: "Urgente",
  HAUTE: "Haute",
  MOYENNE: "Moyenne",
  BASSE: "Basse",
};

export const prioriteTicketBadgeClass: Record<PrioriteTicket, string> = {
  URGENTE: "bg-red-100 text-red-800 ring-red-600/20",
  HAUTE: "bg-amber-100 text-amber-800 ring-amber-600/20",
  MOYENNE: "bg-sky-100 text-sky-800 ring-sky-600/20",
  BASSE: "bg-slate-100 text-slate-600 ring-slate-600/20",
};

export const statutTicketLabel: Record<StatutTicket, string> = {
  OUVERT: "Ouvert",
  EN_COURS: "En cours",
  EN_ATTENTE_CLIENT: "En attente client",
  RESOLU: "Résolu",
  FERME: "Fermé",
};

export const statutTicketBadgeClass: Record<StatutTicket, string> = {
  OUVERT: "bg-sky-100 text-sky-800 ring-sky-600/20",
  EN_COURS: "bg-violet-100 text-violet-800 ring-violet-600/20",
  EN_ATTENTE_CLIENT: "bg-amber-100 text-amber-800 ring-amber-600/20",
  RESOLU: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  FERME: "bg-slate-100 text-slate-500 ring-slate-600/20",
};

export const origineTicketLabel: Record<OrigineTicket, string> = {
  MANUEL: "Manuel",
  AUTO_AGENT_VOCAL: "Auto — agent vocal",
};

/// SLA cibles actés — utilisés pour calculer l'échéance depuis dateCreation.
export const SLA_TICKET = {
  PREMIERE_REPONSE_HEURES: 4,
  RESOLUTION_HEURES_MIN: 24,
  RESOLUTION_HEURES_MAX: 48,
} as const;
