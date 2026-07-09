"use client";

import { useMemo, useState } from "react";
import {
  defaultActionsCp,
  defaultTauxConversion,
  defaultPaliersCxp,
  defaultParametreCxp,
  defaultCatalogue,
  simulerReinitialisationCxp,
  type ActionDeclencheurCpVM,
  type TauxConversionCpVM,
  type PalierCxpVM,
  type ArticleCatalogueVM,
} from "@/lib/fidelite";
import {
  typeBienRecompenseLabel,
  statutArticleCatalogueLabel,
  statutArticleCatalogueBadgeClass,
  regleExpirationCxpLabel,
} from "@/lib/labels";
import { Card, Button, inputClass } from "@/components/ui";
import type { RegleExpirationCxp } from "@/generated/prisma/enums";

function ToggleActif({ actif, onToggle }: { actif: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={actif}
      className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        actif ? "bg-[#3333CE]" : "bg-[#E4E7F5]"
      }`}
    >
      <span
        className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          actif ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function ParametresFidelitePage() {
  const [actionsCp, setActionsCp] = useState<ActionDeclencheurCpVM[]>(defaultActionsCp);
  const [tauxConversion, setTauxConversion] = useState<TauxConversionCpVM[]>(defaultTauxConversion);
  const [paliersCxp, setPaliersCxp] = useState<PalierCxpVM[]>(defaultPaliersCxp);
  const [regleExpiration, setRegleExpiration] = useState<RegleExpirationCxp>(defaultParametreCxp.regleExpiration);
  const [dureeVieJoursPersonnalisee, setDureeVieJoursPersonnalisee] = useState<number>(
    defaultParametreCxp.dureeVieJoursPersonnalisee ?? 365
  );
  const [catalogue, setCatalogue] = useState<ArticleCatalogueVM[]>(defaultCatalogue);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [scoreSimulation, setScoreSimulation] = useState<number>(550);
  const resultatSimulation = useMemo(
    () => simulerReinitialisationCxp(scoreSimulation, paliersCxp),
    [scoreSimulation, paliersCxp]
  );

  function markDirty() {
    setSavedMessage(null);
  }

  function handleSave() {
    setSavedMessage(
      "Configuration mise à jour pour cette session — pas encore persistée : la base de données n'est pas encore branchée."
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2340]">Paramètres — Programme de fidélité (CP / CXP)</h1>
        <p className="text-sm text-[#5C6584]">
          Système universel : les paliers et le catalogue sont identiques partout. Seul le taux d&apos;attribution
          de CP varie par devise — décision actée le 9 juillet 2026 pour éviter une logique différente par pays.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card title="Actions déclenchantes CP">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[#E4E7F5] text-xs uppercase tracking-wide text-[#8891B0]">
                <tr>
                  <th className="py-2 pr-4 font-medium">Action</th>
                  <th className="py-2 pr-4 font-medium">CP attribué</th>
                  <th className="py-2 pr-4 font-medium">Durée de vie</th>
                  <th className="py-2 pr-4 font-medium">Actif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0FC]">
                {actionsCp.map((action) => (
                  <tr key={action.id}>
                    <td className="py-2.5 pr-4 text-[#1B2340]">{action.nom}</td>
                    <td className="py-2.5 pr-4 text-[#5C6584]">
                      {action.calculViaTauxConversion ? (
                        <span className="rounded-full bg-[#F1F2FA] px-2 py-0.5 text-xs text-[#5C6584]">
                          Calculé via taux de conversion
                        </span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          value={action.cpAttribue ?? 0}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setActionsCp((prev) =>
                              prev.map((a) => (a.id === action.id ? { ...a, cpAttribue: value } : a))
                            );
                            markDirty();
                          }}
                          className={`${inputClass} w-24 py-1 text-right`}
                        />
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-[#5C6584]">
                      {action.dureeVieJours ? `${action.dureeVieJours} j` : "Par défaut"}
                    </td>
                    <td className="py-2.5 pr-4">
                      <ToggleActif
                        actif={action.actif}
                        onToggle={() => {
                          setActionsCp((prev) =>
                            prev.map((a) => (a.id === action.id ? { ...a, actif: !a.actif } : a))
                          );
                          markDirty();
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Taux de conversion CP par devise">
          <p className="mb-3 text-xs text-[#8891B0]">
            Utilisé par les actions calculées automatiquement (achat de crédits, marketplace, co-partenaires).
            Indicatif — à recalibrer par Finance avant mise en production.
          </p>
          <div className="flex flex-col gap-3">
            {tauxConversion.map((taux) => (
              <div key={taux.id} className="flex items-center gap-3 text-sm">
                <span className="w-16 font-medium text-[#1B2340]">{taux.devise}</span>
                <span className="text-[#8891B0]">CP =</span>
                <input
                  type="number"
                  min={0}
                  value={taux.cpAttribue}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTauxConversion((prev) =>
                      prev.map((t) => (t.id === taux.id ? { ...t, cpAttribue: value } : t))
                    );
                    markDirty();
                  }}
                  className={`${inputClass} w-20 py-1 text-right`}
                />
                <span className="text-[#8891B0]">CP pour</span>
                <input
                  type="number"
                  min={0}
                  value={taux.montantParUnite}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTauxConversion((prev) =>
                      prev.map((t) => (t.id === taux.id ? { ...t, montantParUnite: value } : t))
                    );
                    markDirty();
                  }}
                  className={`${inputClass} w-28 py-1 text-right`}
                />
                <span className="text-[#8891B0]">{taux.devise}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Paliers CXP">
          <p className="mb-3 text-xs text-[#8891B0]">
            Noms non figés — proposition en cours de validation d&apos;équipe. Le CXP n&apos;est jamais
            convertible : il détermine uniquement le palier.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#E4E7F5] text-xs uppercase tracking-wide text-[#8891B0]">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nom</th>
                  <th className="py-2 pr-4 font-medium">Seuil CXP</th>
                  <th className="py-2 pr-4 font-medium">Privilèges</th>
                  <th className="py-2 pr-4 font-medium">Actif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0FC]">
                {paliersCxp.map((palier) => (
                  <tr key={palier.id}>
                    <td className="py-2.5 pr-4">
                      <input
                        type="text"
                        value={palier.nom}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPaliersCxp((prev) =>
                            prev.map((p) => (p.id === palier.id ? { ...p, nom: value } : p))
                          );
                          markDirty();
                        }}
                        className={`${inputClass} w-32 py-1`}
                      />
                    </td>
                    <td className="py-2.5 pr-4">
                      <input
                        type="number"
                        min={0}
                        value={palier.seuilCxp}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setPaliersCxp((prev) =>
                            prev.map((p) => (p.id === palier.id ? { ...p, seuilCxp: value } : p))
                          );
                          markDirty();
                        }}
                        className={`${inputClass} w-24 py-1 text-right`}
                      />
                    </td>
                    <td className="py-2.5 pr-4 text-[#5C6584]">{palier.privileges}</td>
                    <td className="py-2.5 pr-4">
                      <ToggleActif
                        actif={palier.actif}
                        onToggle={() => {
                          setPaliersCxp((prev) =>
                            prev.map((p) => (p.id === palier.id ? { ...p, actif: !p.actif } : p))
                          );
                          markDirty();
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t border-[#EEF0FC] pt-5">
            <h3 className="mb-3 text-sm font-semibold text-[#1B2340]">Durée de vie du score CXP</h3>
            <div className="flex flex-wrap items-center gap-2">
              {(["ANNIVERSAIRE_INSCRIPTION", "PERSONNALISEE"] as RegleExpirationCxp[]).map((regle) => (
                <button
                  key={regle}
                  type="button"
                  onClick={() => {
                    setRegleExpiration(regle);
                    markDirty();
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    regleExpiration === regle
                      ? "bg-[#3333CE] text-white"
                      : "bg-white text-[#5C6584] ring-1 ring-inset ring-[#E4E7F5] hover:text-[#1B2340]"
                  }`}
                >
                  {regleExpirationCxpLabel[regle]}
                </button>
              ))}
              {regleExpiration === "PERSONNALISEE" && (
                <span className="flex items-center gap-2 text-sm text-[#5C6584]">
                  <input
                    type="number"
                    min={1}
                    value={dureeVieJoursPersonnalisee}
                    onChange={(e) => {
                      setDureeVieJoursPersonnalisee(Number(e.target.value));
                      markDirty();
                    }}
                    className={`${inputClass} w-24 py-1 text-right`}
                  />
                  jours
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-[#F9FAFE] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1B2340]">Simulateur de réinitialisation annuelle</h3>
            <p className="mb-3 text-xs text-[#8891B0]">
              À la date anniversaire, on retire l&apos;écart entre le score final et le plancher du palier
              atteint — le compte garde son palier mais perd la progression au-dessus du plancher.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-[#5C6584]">
                Score CXP à la date anniversaire
                <input
                  type="number"
                  min={0}
                  value={scoreSimulation}
                  onChange={(e) => setScoreSimulation(Number(e.target.value))}
                  className={`${inputClass} w-24 py-1 text-right`}
                />
              </label>
              <span className="text-sm text-[#8891B0]">→</span>
              <span className="text-sm text-[#1B2340]">
                Palier <strong>{resultatSimulation.palier.nom}</strong> · nouveau score{" "}
                <strong>{resultatSimulation.nouveauScore}</strong> · CXP perdu{" "}
                <strong className="text-red-600">{resultatSimulation.cxpPerdu}</strong>
              </span>
            </div>
          </div>
        </Card>

        <Card title="Catalogue marketplace">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#E4E7F5] text-xs uppercase tracking-wide text-[#8891B0]">
                <tr>
                  <th className="py-2 pr-4 font-medium">Article</th>
                  <th className="py-2 pr-4 font-medium">Coût CP</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Offrable à un tiers</th>
                  <th className="py-2 pr-4 font-medium">Stock</th>
                  <th className="py-2 pr-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0FC]">
                {catalogue.map((article) => (
                  <tr key={article.id}>
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-[#1B2340]">{article.nom}</p>
                      {article.description && <p className="text-xs text-[#8891B0]">{article.description}</p>}
                    </td>
                    <td className="py-2.5 pr-4 text-[#1B2340]">{article.coutCp}</td>
                    <td className="py-2.5 pr-4 text-[#5C6584]">{typeBienRecompenseLabel[article.type]}</td>
                    <td className="py-2.5 pr-4">
                      <ToggleActif
                        actif={article.offrableATiers}
                        onToggle={() => {
                          setCatalogue((prev) =>
                            prev.map((a) => (a.id === article.id ? { ...a, offrableATiers: !a.offrableATiers } : a))
                          );
                          markDirty();
                        }}
                      />
                    </td>
                    <td className="py-2.5 pr-4 text-[#5C6584]">{article.stockDisponible ?? "Illimité"}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statutArticleCatalogueBadgeClass[article.statut]}`}
                      >
                        {statutArticleCatalogueLabel[article.statut]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#8891B0]">
            Catalogue pensé pour être enrichi dans la durée — l&apos;ajout d&apos;un nouvel article n&apos;est
            pas encore construit ici, cet écran affiche la configuration actuelle.
          </p>
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={handleSave}>Enregistrer la configuration</Button>
        {savedMessage && <span className="text-sm text-emerald-600">{savedMessage}</span>}
      </div>
    </div>
  );
}
