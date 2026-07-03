import type {
  Segment,
  NiveauAccompagnement,
  PhaseLifecycle,
  StatutHealthScore,
  StatutAbonnement,
  TypeActivitePartenaire,
  TypeInteraction,
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

export type HealthScoreSnapshotVM = {
  id: string;
  score: number;
  statut: StatutHealthScore;
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

export type AccountVM = {
  id: string;
  segment: Segment;
  nom: string;
  niveauAccompagnement: NiveauAccompagnement;
  phaseLifecycle: PhaseLifecycle;
  healthScoreActuel?: number;
  healthScoreStatut?: StatutHealthScore;
  csmAssigne?: string;
  dateCreation: string;
  contacts: ContactVM[];
  interactions: InteractionVM[];
  healthScoreHistorique: HealthScoreSnapshotVM[];
  passionneProfile?: PassionneProfileVM;
  partenaireProfile?: PartenaireProfileVM;
  entrepriseQvtProfile?: EntrepriseQvtProfileVM;
};
