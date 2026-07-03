import Link from "next/link";
import { mockAccounts } from "@/lib/mock-data";
import { segmentLabel, phaseLifecycleLabel } from "@/lib/labels";
import { AccompagnementBadge, HealthScoreBadge } from "@/components/ui";
import type { Segment } from "@/generated/prisma/enums";

const SEGMENT_TABS: { key: Segment | "TOUS"; label: string }[] = [
  { key: "TOUS", label: "Tous les comptes" },
  { key: "PASSIONNE", label: "Passionnés" },
  { key: "PARTENAIRE", label: "Partenaires" },
  { key: "ENTREPRISE_QVT", label: "Entreprises QVT" },
];

export default async function ComptesPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string; q?: string }>;
}) {
  const { segment, q } = await searchParams;
  const activeSegment = (segment as Segment | undefined) ?? undefined;

  const accounts = mockAccounts
    .filter((a) => !activeSegment || a.segment === activeSegment)
    .filter((a) => !q || a.nom.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Comptes</h1>
          <p className="text-sm text-slate-500">
            Vue liste des 3 segments — Passionnés, Partenaires, Entreprises QVT.
          </p>
        </div>
        <form className="w-72">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher un compte..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
          />
          {activeSegment && <input type="hidden" name="segment" value={activeSegment} />}
        </form>
      </div>

      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {SEGMENT_TABS.map((tab) => {
          const isActive = (tab.key === "TOUS" && !activeSegment) || tab.key === activeSegment;
          const href = tab.key === "TOUS" ? "/comptes" : `/comptes?segment=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                isActive
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Compte</th>
              <th className="px-4 py-3 font-medium">Segment</th>
              <th className="px-4 py-3 font-medium">Phase lifecycle</th>
              <th className="px-4 py-3 font-medium">Accompagnement</th>
              <th className="px-4 py-3 font-medium">Health Score</th>
              <th className="px-4 py-3 font-medium">CSM assigné</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/comptes/${account.id}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {account.nom}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{segmentLabel[account.segment]}</td>
                <td className="px-4 py-3 text-slate-600">
                  {phaseLifecycleLabel[account.phaseLifecycle]}
                </td>
                <td className="px-4 py-3">
                  <AccompagnementBadge niveau={account.niveauAccompagnement} />
                </td>
                <td className="px-4 py-3">
                  <HealthScoreBadge
                    score={account.healthScoreActuel}
                    statut={account.healthScoreStatut}
                  />
                </td>
                <td className="px-4 py-3 text-slate-600">{account.csmAssigne ?? "—"}</td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Aucun compte ne correspond à ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
