import Link from "next/link";
import { mockAccounts } from "@/lib/mock-data";
import {
  segmentLabel,
  phaseLifecycleLabel,
  phaseLifecycleObjectif,
  phaseLifecycleBadgeClass,
  typeMomentDeVeriteLabel,
  canalCommunicationLabel,
} from "@/lib/labels";
import { RisqueScoreBadge } from "@/components/ui";
import type { AccountVM, MomentDeVeriteVM } from "@/lib/types";
import type { PhaseLifecycle, Segment } from "@/generated/prisma/enums";

const PHASES: PhaseLifecycle[] = ["ONBOARDING", "ADOPTION", "EXPANSION", "A_RISQUE", "CHURN"];

const MOMENT_PAR_SEGMENT: Record<Segment, MomentDeVeriteVM["type"]> = {
  PASSIONNE: "PREMIERE_SESSION_REUSSIE",
  PARTENAIRE: "PREMIERE_RESERVATION",
  ENTREPRISE_QVT: "PREMIER_REPORTING_QVT_POSITIF",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function AccountCard({ account }: { account: AccountVM }) {
  const momentAttendu = account.momentsDeVerite.find(
    (m) => m.type === MOMENT_PAR_SEGMENT[account.segment]
  );
  const execution = account.playbookExecutions.find((p) => p.statut === "EN_COURS");
  const prochaineEtape = execution?.etapes.find((e) => e.statut === "A_FAIRE");
  const enRetard = prochaineEtape ? new Date(prochaineEtape.dateEcheance) < new Date("2026-07-07") : false;

  return (
    <Link
      href={`/comptes/${account.id}`}
      className="block rounded-lg border border-[#E4E7F5] bg-white p-3 shadow-sm hover:border-[#E4E7F5] hover:shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-[#1B2340]">{account.nom}</p>
          <p className="text-xs text-[#5C6584]">{segmentLabel[account.segment]}</p>
        </div>
        <RisqueScoreBadge score={account.risqueScoreActuel} statut={account.risqueScoreStatut} />
      </div>

      {momentAttendu && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={momentAttendu.dateAtteint ? "text-emerald-600" : "text-[#8891B0]"}>
            {momentAttendu.dateAtteint ? "✓" : "○"}
          </span>
          <span className="text-[#5C6584]">
            {typeMomentDeVeriteLabel[momentAttendu.type]}
            {momentAttendu.dateAtteint
              ? ` — atteint le ${formatDate(momentAttendu.dateAtteint)}`
              : momentAttendu.dateCibleAvant
                ? ` — attendu avant le ${formatDate(momentAttendu.dateCibleAvant)}`
                : ""}
          </span>
        </div>
      )}

      {execution && (
        <div className="mt-2 rounded-md bg-[#EEF0FC] px-2 py-1.5">
          <p className="text-xs font-medium text-[#3333CE]">{execution.playbookNom}</p>
          {prochaineEtape ? (
            <p className={`text-xs ${enRetard ? "text-red-600" : "text-[#3333CE]"}`}>
              {prochaineEtape.titre}
              {prochaineEtape.canal !== "AUCUN" && ` (${canalCommunicationLabel[prochaineEtape.canal]})`}
              {" — "}
              {enRetard ? "en retard, échéance " : "échéance "}
              {formatDate(prochaineEtape.dateEcheance)}
            </p>
          ) : (
            <p className="text-xs text-[#3333CE]">Toutes les étapes sont faites</p>
          )}
        </div>
      )}
    </Link>
  );
}

export default async function LifecyclePage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const { segment } = await searchParams;
  const activeSegment = (segment as Segment | undefined) ?? undefined;

  const accounts = mockAccounts.filter((a) => !activeSegment || a.segment === activeSegment);

  const SEGMENT_TABS: { key: Segment | "TOUS"; label: string }[] = [
    { key: "TOUS", label: "Tous les segments" },
    { key: "PASSIONNE", label: "Passionnés" },
    { key: "PARTENAIRE", label: "Partenaires" },
    { key: "ENTREPRISE_QVT", label: "Entreprises QVT" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2340]">Onboarding & lifecycle</h1>
        <p className="text-sm text-[#5C6584]">
          Vue des comptes par phase, avec moments de vérité et playbooks en cours.
        </p>
      </div>

      <div className="mb-5 flex gap-1 border-b border-[#E4E7F5]">
        {SEGMENT_TABS.map((tab) => {
          const isActive = (tab.key === "TOUS" && !activeSegment) || tab.key === activeSegment;
          const href = tab.key === "TOUS" ? "/lifecycle" : `/lifecycle?segment=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                isActive
                  ? "border-[#3333CE] text-[#3333CE]"
                  : "border-transparent text-[#5C6584] hover:text-[#1B2340]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {PHASES.map((phase) => {
          const accountsInPhase = accounts.filter((a) => a.phaseLifecycle === phase);
          return (
            <div key={phase} className="flex flex-col gap-3">
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${phaseLifecycleBadgeClass[phase]}`}
                >
                  {phaseLifecycleLabel[phase]} · {accountsInPhase.length}
                </span>
                <p className="mt-1.5 text-xs text-[#5C6584]">{phaseLifecycleObjectif[phase]}</p>
              </div>
              <div className="flex flex-col gap-2">
                {accountsInPhase.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
                {accountsInPhase.length === 0 && (
                  <p className="rounded-lg border border-dashed border-[#E4E7F5] px-3 py-4 text-center text-xs text-[#8891B0]">
                    Aucun compte
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
