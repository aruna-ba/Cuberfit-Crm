import type { TypeBienRecompense, StatutArticleCatalogue, RegleExpirationCxp } from "@/generated/prisma/enums";

export type ActionDeclencheurCpVM = {
  id: string;
  nom: string;
  actif: boolean;
  cpAttribue?: number;
  calculViaTauxConversion: boolean;
  dureeVieJours?: number;
};

export type TauxConversionCpVM = {
  id: string;
  devise: string;
  montantParUnite: number;
  cpAttribue: number;
};

export type PalierCxpVM = {
  id: string;
  ordre: number;
  nom: string;
  seuilCxp: number;
  privileges: string;
  actif: boolean;
};

export type ArticleCatalogueVM = {
  id: string;
  nom: string;
  description?: string;
  coutCp: number;
  type: TypeBienRecompense;
  offrableATiers: boolean;
  stockDisponible?: number;
  statut: StatutArticleCatalogue;
};

/**
 * Données de démonstration pour le module P2 (Programme de fidélité CP/CXP).
 * Règles actées avec Harouna le 2026-07-09 : CP convertibles/non transférables
 * (mais l'article acheté peut être offert à un tiers), CXP non convertibles
 * qui déterminent un palier, réinitialisés à l'anniversaire d'inscription
 * (retour au plancher du palier, pas à zéro). Système universel : seul le
 * taux d'attribution CP par devise varie selon le marché, pas les paliers ni
 * le catalogue. Chiffres repris du document "Cuberfit programme de
 * fidélité.pdf" (T03 2026) partagé par Harouna, à recalibrer par
 * Finance/Awa avant mise en prod. À remplacer par de vraies tables Prisma
 * une fois la base branchée.
 */
export const defaultActionsCp: ActionDeclencheurCpVM[] = [
  { id: "act_1", nom: "Inscription", actif: true, cpAttribue: 25, calculViaTauxConversion: false, dureeVieJours: 365 },
  { id: "act_2", nom: "Inscription + 1er achat de crédits", actif: true, cpAttribue: 25, calculViaTauxConversion: false, dureeVieJours: 365 },
  { id: "act_3", nom: "Achat de crédits", actif: true, calculViaTauxConversion: true, dureeVieJours: 365 },
  { id: "act_4", nom: "Achat sur la marketplace (partenaire)", actif: true, calculViaTauxConversion: true, dureeVieJours: 365 },
  { id: "act_5", nom: "Achat chez un co-partenaire (ex. Décathlon)", actif: true, calculViaTauxConversion: true, dureeVieJours: 365 },
  { id: "act_6", nom: "Première réservation", actif: true, cpAttribue: 100, calculViaTauxConversion: false, dureeVieJours: 365 },
  { id: "act_7", nom: "Première activité réalisée", actif: true, cpAttribue: 150, calculViaTauxConversion: false, dureeVieJours: 365 },
  { id: "act_8", nom: "Avis laissé", actif: true, cpAttribue: 25, calculViaTauxConversion: false, dureeVieJours: 365 },
  { id: "act_9", nom: "Parrainage — le filleul s'inscrit", actif: true, cpAttribue: 20, calculViaTauxConversion: false, dureeVieJours: 365 },
  { id: "act_10", nom: "Parrainage — le filleul atteint un seuil de crédits dépensés", actif: true, cpAttribue: 20, calculViaTauxConversion: false, dureeVieJours: 365 },
  { id: "act_11", nom: "Challenge hebdomadaire terminé", actif: true, cpAttribue: 15, calculViaTauxConversion: false, dureeVieJours: 180 },
  { id: "act_12", nom: "Marathon / gros événement", actif: true, cpAttribue: 50, calculViaTauxConversion: false, dureeVieJours: 180 },
];

export const defaultTauxConversion: TauxConversionCpVM[] = [
  { id: "taux_xof", devise: "XOF", montantParUnite: 1000, cpAttribue: 5 },
  { id: "taux_mad", devise: "MAD", montantParUnite: 20, cpAttribue: 5 },
  { id: "taux_ngn", devise: "NGN", montantParUnite: 2000, cpAttribue: 5 },
];

export const defaultPaliersCxp: PalierCxpVM[] = [
  { id: "palier_1", ordre: 1, nom: "Palier 1", seuilCxp: 0, privileges: "Profil basique, accès standard aux challenges.", actif: true },
  { id: "palier_2", ordre: 2, nom: "Palier 2", seuilCxp: 150, privileges: "Badge visible, accès aux challenges intermédiaires, +5% de bonus CXP sur certaines actions.", actif: true },
  { id: "palier_3", ordre: 3, nom: "Palier 3", seuilCxp: 300, privileges: "Priorité sur certains créneaux, +5% de bonus CP.", actif: true },
  { id: "palier_4", ordre: 4, nom: "Palier 4", seuilCxp: 600, privileges: "Accès aux contenus Play premium, +10% de bonus CP.", actif: true },
  { id: "palier_5", ordre: 5, nom: "Palier 5", seuilCxp: 1000, privileges: "Badge spécial, challenges élite, accès à l'événement annuel, mise en avant \"Top mover\".", actif: true },
];

export const defaultParametreCxp: { regleExpiration: RegleExpirationCxp; dureeVieJoursPersonnalisee?: number } = {
  regleExpiration: "ANNIVERSAIRE_INSCRIPTION",
};

export const defaultCatalogue: ArticleCatalogueVM[] = [
  { id: "cat_1", nom: "Réduction de 10% sur une séance", description: "Applicable sur une séance ou un pack spécifique.", coutCp: 300, type: "IMMATERIEL", offrableATiers: false, statut: "ACTIF" },
  { id: "cat_2", nom: "Séance découverte offerte", description: "Chez un nouveau partenaire, à choisir dans le catalogue d'activités.", coutCp: 500, type: "IMMATERIEL", offrableATiers: true, statut: "ACTIF" },
  { id: "cat_3", nom: "Accès VIP / cours premium", description: "Workshop ou cours premium en accès prioritaire.", coutCp: 1000, type: "IMMATERIEL", offrableATiers: true, statut: "ACTIF" },
  { id: "cat_4", nom: "Pack de goodies co-brandés", description: "T-shirt, gourde Cuberfit x partenaire.", coutCp: 1500, type: "MATERIEL", offrableATiers: true, stockDisponible: 40, statut: "ACTIF" },
  { id: "cat_5", nom: "Bon d'achat partenaire (Décathlon)", description: "Bon d'achat cofinancé par le partenaire.", coutCp: 2000, type: "MATERIEL", offrableATiers: true, stockDisponible: 15, statut: "ACTIF" },
];

/**
 * Simule la réinitialisation annuelle du score CXP à la date anniversaire
 * d'inscription : on retire l'écart entre le score final et le seuil
 * plancher du palier atteint. Le compte ne redescend jamais sous le
 * plancher de son palier actuel, mais perd toute la progression accumulée
 * au-dessus de ce plancher.
 */
export function simulerReinitialisationCxp(
  scoreFinal: number,
  paliers: PalierCxpVM[] = defaultPaliersCxp
): { palier: PalierCxpVM; nouveauScore: number; cxpPerdu: number } {
  const paliersActifs = [...paliers].filter((p) => p.actif).sort((a, b) => a.seuilCxp - b.seuilCxp);
  const palier =
    [...paliersActifs].reverse().find((p) => scoreFinal >= p.seuilCxp) ?? paliersActifs[0];
  const nouveauScore = palier.seuilCxp;
  const cxpPerdu = Math.max(0, scoreFinal - nouveauScore);
  return { palier, nouveauScore, cxpPerdu };
}

export function getPalierActuel(scoreCxp: number, paliers: PalierCxpVM[] = defaultPaliersCxp): PalierCxpVM {
  return simulerReinitialisationCxp(scoreCxp, paliers).palier;
}
