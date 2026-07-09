export type PalierCxpVM = {
  ordre: number;
  nom: string;
  seuilCxp: number;
};

/**
 * Seuils des 5 paliers CXP, pour affichage seul (badge sur la fiche
 * Passionné). La configuration et le catalogue du programme de fidélité
 * (CP/CXP) sont gérés directement dans Cuberfit Access — décision du
 * 2026-07-10 — pas dans ce CRM. Ces seuils ne sont donc qu'une copie de
 * lecture pour dériver le palier affiché ; noms non figés (proposition en
 * cours : Origin/Momentum/Ascension/Vitality/Zenith).
 */
export const PALIERS_CXP: PalierCxpVM[] = [
  { ordre: 1, nom: "Palier 1", seuilCxp: 0 },
  { ordre: 2, nom: "Palier 2", seuilCxp: 150 },
  { ordre: 3, nom: "Palier 3", seuilCxp: 300 },
  { ordre: 4, nom: "Palier 4", seuilCxp: 600 },
  { ordre: 5, nom: "Palier 5", seuilCxp: 1000 },
];

export function getPalierActuel(cxpActuel: number): PalierCxpVM {
  return (
    [...PALIERS_CXP].reverse().find((p) => cxpActuel >= p.seuilCxp) ?? PALIERS_CXP[0]
  );
}
