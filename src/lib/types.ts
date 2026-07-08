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
  StatutCampagne,
  StatutEnvoiCampagne,
  CanalEntreeTicket,
  PrioriteTicket,
  StatutTicket,
  OrigineTicket,
  EtapePipelinePartenaire,
  EtapePipelineQvt,
  TypeOpportunite,
  StatutOpportunite,
} from "@/generated/prisma/enums";

export type ContactVM = {
  id: string;
  prenom: string;
  nom: string;
  email?: string;
  telephone?: string;
  role?: string;
  estContactPrincipal: boolean;
};

export type InteractionVM = {
  id: string;
  type: TypeInteraction;
  titre: string;
  description?: string;
  dateInteraction: string;
  creePar?: string;
};

export type RisqueScoreSnapshotVM = {
  id: string;
  score: number;
  statut: StatutRisqueScore;
  dateCalcul: string;
  detailCriteres: { critere: string; poidsPct: number; valeur: string }[];
};

export type PassionneProfileVM = {
  email: string;
  telephone?: string;
  ville?: string;
  statutAbonnement: StatutAbonnement;
  creditsAchetes: number;
  creditsConsommes: number;
  creditsDormants: number;
  nombreNoShow: number;
  nombreAnnulations: number;
  npsScore?: number;
  dateDerniereActivite?: string;
  coachsAssocies: { id: string; nom: string }[];
};

export type PartenaireProfileVM = {
  typeActivite: TypeActivitePartenaire;
  ville?: string;
  adresse?: string;
  statutProfilCompletudePct: number;
  tauxRemplissageMoyenPct?: number;
  reservationsRecuesTotal: number;
  satisfactionScore?: number;
  dateSignature?: string;
};

export type EntrepriseQvtProfileVM = {
  secteurActivite?: string;
  tailleEffectif?: number;
  budgetAllouAnnuel?: number;
  budgetConsommeAnnuel?: number;
  pctEmployesActives?: number;
  pctEmployesActifsMensuels?: number;
  dateSignature?: string;
  dateRenouvellement?: string;
};

export type MomentDeVeriteVM = {
  id: string;
  type: TypeMomentDeVerite;
  dateCibleAvant?: string;
  dateAtteint?: string;
};

export type EtapeExecutionVM = {
  id: string;
  ordre: number;
  titre: string;
  typeAction: TypeActionEtape;
  canal: CanalCommunication;
  statut: StatutEtapePlaybook;
  dateEcheance: string;
  dateRealisation?: string;
  assigneA?: string;
  templateNom?: string;
};

export type PlaybookExecutionVM = {
  id: string;
  playbookNom: string;
  statut: StatutPlaybookExecution;
  dateDeclenchement: string;
  etapes: EtapeExecutionVM[];
};

export type AccountVM = {
  id: string;
  segment: Segment;
  nom: string;
  niveauAccompagnement: NiveauAccompagnement;
  phaseLifecycle: PhaseLifecycle;
  risqueScoreActuel?: number;
  risqueScoreStatut?: StatutRisqueScore;
  csmAssigne?: string;
  dateCreation: string;
  contacts: ContactVM[];
  interactions: InteractionVM[];
  risqueScoreHistorique: RisqueScoreSnapshotVM[];
  momentsDeVerite: MomentDeVeriteVM[];
  playbookExecutions: PlaybookExecutionVM[];
  passionneProfile?: PassionneProfileVM;
  partenaireProfile?: PartenaireProfileVM;
  entrepriseQvtProfile?: EntrepriseQvtProfileVM;
};

// ---------------------------------------------------------------------------
// Module P0-4 — Communication multicanale
// ---------------------------------------------------------------------------

export type TemplateVM = {
  id: string;
  nom: string;
  canal: CanalCommunication;
  segment?: Segment;
  phase?: PhaseLifecycle;
  sujet?: string;
  corps: string;
  actif: boolean;
};

export type CampagneEnvoiVM = {
  id: string;
  accountId: string;
  accountNom: string;
  statut: StatutEnvoiCampagne;
  dateEnvoi?: string;
  dateLecture?: string;
};

export type CampagneVM = {
  id: string;
  nom: string;
  description?: string;
  segmentCible?: Segment;
  phaseCible?: PhaseLifecycle;
  canal: CanalCommunication;
  templateId: string;
  templateNom: string;
  statut: StatutCampagne;
  datePlanifiee?: string;
  dateEnvoi?: string;
  dateCreation: string;
  envois: CampagneEnvoiVM[];
};

// ---------------------------------------------------------------------------
// Module P0-5 — Tickets & support
// ---------------------------------------------------------------------------

export type TicketVM = {
  id: string;
  numero: number;
  accountId: string;
  accountNom: string;
  sujet: string;
  description?: string;
  canalEntree: CanalEntreeTicket;
  priorite: PrioriteTicket;
  statut: StatutTicket;
  origine: OrigineTicket;
  assigneA?: string;
  dateCreation: string;
  datePremiereReponse?: string;
  dateResolution?: string;
  csatScore?: number;
  csatCommentaire?: string;
};

// ---------------------------------------------------------------------------
// Module P1-1 — Pipeline & Opportunités
// ---------------------------------------------------------------------------

export type OpportuniteVM = {
  id: string;
  accountId: string;
  accountNom: string;
  segment: Segment;
  type: TypeOpportunite;
  etapePartenaire?: EtapePipelinePartenaire;
  etapeQvt?: EtapePipelineQvt;
  statut: StatutOpportunite;
  montantEstimeAnnuel?: number;
  probabilitePct?: number;
  proprietaire?: string;
  dateCreation: string;
  dateClotureprevue?: string;
  dateCloture?: string;
};
