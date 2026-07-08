import Link from "next/link";
import { mockAccounts } from "@/lib/mock-data";
import { segmentLabel, phaseLifecycleLabel, roleUtilisateurLabel } from "@/lib/labels";
import { getSegmentsAutorises } from "@/lib/habilitations";
import { AccompagnementBadge, RisqueScoreBadge } from "@/components/ui";
import type { RoleUtilisateur, Segment } from "@/generated/prisma/enums";

const SEGMENT_TABS: { key: Segment | "TOUS"; label: string }[] = [
  { key: "TOUS", label: "Tous les comptes" },
  { key: "PASSIONNE", label: "Passionnés" },
  { key: "PARTENAIRE", label: "Partenaires" },
  { key: "ENTREPRISE_QVT", label: "Entreprises QVT" },
];

const ROLES: RoleUtilisateur[] = [
  "ADMIN",
  "ACTIVATION_MANAGER",
  "SALES_CORPORATE",
  "ACCOUNT_MANAGER",
  "CS_OPS_SUPPORT",
  "LECTURE_SEULE",
];

export default async function ComptesPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string; q?: string; role?: string }>;
}) {
  const { segment, q, role } = await searchParams;
  const activeSegment = (segment as Segment | undefined) ?? undefined;
  const activeRole: RoleUtilisateur = ROLES.includes(role as RoleUtilisateur)
    ? (role as RoleUtilisateur)
    : "ADMIN";
  const segmentsAutorises = getSegmentsAutorises(activeRole);

  const accounts = mockAccounts
    .filter((a) => segmentsAutorises.includes(a.segment))
    .filter((a) => !activeSegment || a.segment === activeSegment)
    .filter((a) => !q || a.nom.toLowerCase().includes(q.toLowerCase()));

  function withRole(href: string) {
    if (activeRole === "ADMIN") return href;
    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}role=${activeRole}`;
  }

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
          {activeRole !== "ADMIN" && <input type="hidden" name="role" value={activeRole} />}
        </form>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-[#D5D9EC] bg-[#F9FAFE] px-3 py-2">
        <span className="text-xs font-medium text-[#8891B0]">Voir en tant que&nbsp;:</span>
        {ROLES.map((r) => (
          <Link
            key={r}
            href={r === "ADMIN" ? "/comptes" : `/comptes?role=${r}`}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              activeRole === r
                ? "bg-[#3333CE] text-white"
                : "bg-white text-[#5C6584] ring-1 ring-inset ring-[#E4E7F5] hover:text-[#1B2340]"
            }`}
          >
            {roleUtilisateurLabel[r]}
          </Link>
        ))}
        <span className="ml-auto text-xs text-[#8891B0]">
          Simulation — aucune authentification branchée pour l&apos;instant.
        </span>
      </div>

      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {SEGMENT_TABS.map((tab) => {
          const isActive = (tab.key === "TOUS" && !activeSegment) || tab.key === activeSegment;
          const autorise = tab.key === "TOUS" || segmentsAutorises.includes(tab.key);
          const href = withRole(tab.key === "TOUS" ? "/comptes" : `/comptes?segment=${tab.key}`);

          if (!autorise) {
            return (
              <span
                key={tab.key}
                title={`${roleUtilisateurLabel[activeRole]} n'a pas accès à ce segment`}
                className="flex cursor-not-allowed items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300"
              >
                🔒 {tab.label}
              </span>
            );
          }
          return (
            <Link
              key={tab.key}
              href={href}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                isActive
                  ? "border-[#3333CE] text-[#3333CE]"
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
              <th className="px-4 py-3 font-medium">Score de risque</th>
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
                  <RisqueScoreBadge
                    score={account.risqueScoreActuel}
                    statut={account.risqueScoreStatut}
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
