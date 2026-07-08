import Link from "next/link";
import {
  getKpiDefinitionsBySegment,
  getKpiHistory,
  getAlertesActives,
  getCohortesBySegment,
  NOMBRE_MOIS_OBSERVATION_MAX,
} from "@/lib/kpis";
import { segmentLabel } from "@/lib/labels";
import { Card } from "@/components/ui";
import type { Segment } from "@/generated/prisma/enums";
import type { KpiDefinitionVM } from "@/lib/types";

const SEGMENTS: Segment[] = ["PASSIONNE", "PARTENAIRE", "ENTREPRISE_QVT"];

function formatValeur(valeur: number, unite: KpiDefinitionVM["unite"]) {
  const arrondi = Number.isInteger(valeur) ? valeur : Math.round(valeur * 10) / 10;
  switch (unite) {
    case "%":
      return `${arrondi}%`;
    case "jours":
      return `${arrondi} j`;
    case "seances_mois":
      return `${arrondi}/mois`;
    case "score":
      return `${arrondi}`;
  }
}

function formatMoisCourt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

function Sparkline({ valeurs, atteintCible }: { valeurs: number[]; atteintCible: boolean }) {
  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  const range = max - min || 1;
  const points = valeurs
    .map((v, i) => {
      const x = (i / (valeurs.length - 1)) * 100;
      const y = 28 - ((v - min) / range) * 24 - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" className="h-7 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={atteintCible ? "#10b981" : "#f43f5e"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function KpiCard({ definition }: { definition: KpiDefinitionVM }) {
  const historique = getKpiHistory(definition.segment, definition.code);
  const valeurActuelle = historique.at(-1)?.valeur ?? 0;
  const atteintCible =
    definition.sens === "PLUS_EST_MIEUX" ? valeurActuelle >= definition.cible : valeurActuelle <= definition.cible;

  return (
    <div className="rounded-lg border border-[#E4E7F5] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[#8891B0]">{definition.libelle}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-[#1B2340]">{formatValeur(valeurActuelle, definition.unite)}</p>
        <p className={`text-xs font-medium ${atteintCible ? "text-emerald-600" : "text-red-500"}`}>
          cible {formatValeur(definition.cible, definition.unite)}
        </p>
      </div>
      <div className="mt-2">
        <Sparkline valeurs={historique.map((h) => h.valeur)} atteintCible={atteintCible} />
      </div>
    </div>
  );
}

function CohortesTable({ segment }: { segment: "PASSIONNE" | "PARTENAIRE" }) {
  const cohortes = getCohortesBySegment(segment);
  const colonnes = Array.from({ length: NOMBRE_MOIS_OBSERVATION_MAX + 1 }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[#8891B0]">
            <th className="py-2 pr-4">Cohorte</th>
            <th className="py-2 pr-4">Taille</th>
            {colonnes.map((m) => (
              <th key={m} className="py-2 pr-4 text-center">
                M+{m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohortes.map((cohorte) => (
            <tr key={cohorte.moisCohorte} className="border-t border-[#EEF0FC]">
              <td className="py-2 pr-4 font-medium capitalize text-[#1B2340]">
                {formatMoisCourt(cohorte.moisCohorte)}
              </td>
              <td className="py-2 pr-4 text-[#5C6584]">{cohorte.tailleInitiale}</td>
              {colonnes.map((m) => {
                const obs = cohorte.observations.find((o) => o.moisObservation === m);
                if (!obs) {
                  return (
                    <td key={m} className="py-2 pr-4 text-center text-[#D5D9EC]">
                      —
                    </td>
                  );
                }
                const intensite = Math.max(0, Math.min(1, obs.pctRetenu / 100));
                return (
                  <td key={m} className="py-2 pr-4 text-center">
                    <span
                      className="inline-block min-w-[3.5rem] rounded px-2 py-0.5 font-medium text-[#1B2340]"
                      style={{ backgroundColor: `rgba(51, 51, 206, ${0.08 + intensite * 0.35})` }}
                    >
                      {obs.pctRetenu}%
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const { segment } = await searchParams;
  const activeSegment: Segment = SEGMENTS.includes(segment as Segment) ? (segment as Segment) : "PASSIONNE";

  const definitions = getKpiDefinitionsBySegment(activeSegment);
  const alertes = getAlertesActives();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2340]">Analytics & reporting</h1>
        <p className="text-sm text-[#5C6584]">
          Dashboards KPIs par segment, alertes et cohortes de rétention — grille de référence du cadrage produit.
        </p>
      </div>

      <Card title="Alertes actives" className="mb-6">
        {alertes.length === 0 ? (
          <p className="text-sm text-[#8891B0]">Tous les KPIs sont dans leur cible.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {alertes.map((alerte) => (
              <li
                key={`${alerte.definition.segment}-${alerte.definition.code}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <Link
                    href={`/analytics?segment=${alerte.definition.segment}`}
                    className="font-medium text-[#1B2340] hover:underline"
                  >
                    {alerte.definition.libelle}
                  </Link>
                  <p className="text-xs text-[#8891B0]">{segmentLabel[alerte.definition.segment]}</p>
                </div>
                <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  {formatValeur(alerte.valeurActuelle, alerte.definition.unite)} · cible{" "}
                  {formatValeur(alerte.definition.cible, alerte.definition.unite)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mb-6 flex gap-1 border-b border-[#E4E7F5]">
        {SEGMENTS.map((seg) => (
          <Link
            key={seg}
            href={`/analytics?segment=${seg}`}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeSegment === seg
                ? "border-[#3333CE] text-[#3333CE]"
                : "border-transparent text-[#5C6584] hover:text-[#1B2340]"
            }`}
          >
            {segmentLabel[seg]}
          </Link>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {definitions.map((definition) => (
          <KpiCard key={definition.code} definition={definition} />
        ))}
      </div>

      <Card title={`Cohortes de rétention — ${segmentLabel[activeSegment]}`}>
        {activeSegment === "ENTREPRISE_QVT" ? (
          <p className="text-sm text-[#8891B0]">
            Pas d&apos;analyse de cohorte pour les Entreprises QVT — acquisition trop peu nombreuse pour être
            significative ; le suivi se fait par renouvellement contractuel (voir le pipeline QVT).
          </p>
        ) : (
          <CohortesTable segment={activeSegment} />
        )}
      </Card>
    </div>
  );
}
