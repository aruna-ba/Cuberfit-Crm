import Link from "next/link";
import { mockAccounts } from "@/lib/mock-data";
import { segmentLabel } from "@/lib/labels";
import { SEUILS_RISQUE_SCORE } from "@/lib/ponderations";
import type { Segment, StatutRisqueScore } from "@/generated/prisma/enums";
import type { AccountVM } from "@/lib/types";

const SEGMENTS: Segment[] = ["PASSIONNE", "PARTENAIRE", "ENTREPRISE_QVT"];
const STATUTS: StatutRisqueScore[] = ["VERT", "ORANGE", "ROUGE"];

const STATUT_STYLE: Record<StatutRisqueScore, { label: string; dot: string; text: string; bar: string }> = {
  VERT: { label: "Sain", dot: "bg-emerald-500", text: "text-emerald-700", bar: "bg-emerald-500" },
  ORANGE: { label: "À surveiller", dot: "bg-amber-500", text: "text-amber-700", bar: "bg-amber-500" },
  ROUGE: { label: "À risque", dot: "bg-red-500", text: "text-red-700", bar: "bg-red-500" },
};

function scored(accounts: AccountVM[]) {
  return accounts.filter((a) => a.risqueScoreStatut !== undefined);
}

function countBy(accounts: AccountVM[], statut: StatutRisqueScore) {
  return accounts.filter((a) => a.risqueScoreStatut === statut).length;
}

export default function ScoreDeRisquePage() {
  const withScore = scored(mockAccounts);
  const total = withScore.length;

  const comptesRouges = withScore
    .filter((a) => a.risqueScoreStatut === "ROUGE")
    .sort((a, b) => (a.risqueScoreActuel ?? 0) - (b.risqueScoreActuel ?? 0));

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Score de risque & churn</h1>
        <p className="text-sm text-slate-500">
          Répartition vert/orange/rouge de tous les comptes, tous segments confondus.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATUTS.map((statut) => {
          const count = countBy(withScore, statut);
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const style = STATUT_STYLE[statut];
          return (
            <div key={statut} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <span className={`text-sm font-medium ${style.text}`}>{style.label}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {count} <span className="text-sm font-normal text-slate-400">compte{count !== 1 ? "s" : ""} · {pct}%</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">{SEUILS_RISQUE_SCORE[statut].action}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Répartition par segment
        </h2>
        <div className="flex flex-col gap-4">
          {SEGMENTS.map((segment) => {
            const accountsInSegment = withScore.filter((a) => a.segment === segment);
            const segmentTotal = accountsInSegment.length;
            return (
              <div key={segment}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{segmentLabel[segment]}</span>
                  <span className="text-slate-400">{segmentTotal} compte{segmentTotal !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  {STATUTS.map((statut) => {
                    const count = countBy(accountsInSegment, statut);
                    const widthPct = segmentTotal > 0 ? (count / segmentTotal) * 100 : 0;
                    if (widthPct === 0) return null;
                    return (
                      <div
                        key={statut}
                        className={STATUT_STYLE[statut].bar}
                        style={{ width: `${widthPct}%` }}
                        title={`${STATUT_STYLE[statut].label}: ${count}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Comptes à risque immédiat ({comptesRouges.length})
          </h2>
        </div>
        {comptesRouges.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">Aucun compte en rouge actuellement.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {comptesRouges.map((account) => (
              <li key={account.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <Link href={`/comptes/${account.id}`} className="text-sm font-medium text-slate-900 hover:underline">
                    {account.nom}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {segmentLabel[account.segment]} · CSM : {account.csmAssigne ?? "—"}
                  </p>
                </div>
                <span className="text-sm font-semibold text-red-600">{account.risqueScoreActuel}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
