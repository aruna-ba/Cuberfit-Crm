import Link from "next/link";
import { mockOpportunites } from "@/lib/opportunites";
import {
  etapePipelinePartenaireLabel,
  etapePipelineQvtLabel,
  typeOpportuniteLabel,
} from "@/lib/labels";
import type { EtapePipelinePartenaire, EtapePipelineQvt, Segment } from "@/generated/prisma/enums";
import type { OpportuniteVM } from "@/lib/types";

const ETAPES_PARTENAIRE: EtapePipelinePartenaire[] = [
  "DECOUVERTE",
  "DIAGNOSTIC",
  "DEMONSTRATION",
  "ENGAGEMENT",
  "ONBOARDING",
  "SUIVI_ACTIF",
  "AMBASSADEUR",
];

const ETAPES_QVT: EtapePipelineQvt[] = [
  "PROSPECT",
  "RDV_DRH",
  "DEMO",
  "PROPOSITION",
  "SIGNATURE",
  "ONBOARDING",
  "ADOPTION",
  "RENOUVELLEMENT",
];

function formatMontant(montant?: number) {
  if (montant === undefined) return null;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    montant
  );
}

function OpportuniteCard({ opportunite }: { opportunite: OpportuniteVM }) {
  const montant = formatMontant(opportunite.montantEstimeAnnuel);
  return (
    <Link
      href={`/pipeline/${opportunite.id}`}
      className={`block rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
        opportunite.statut === "PERDUE" ? "border-slate-200 opacity-60" : "border-[#E4E7F5]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-[#1B2340]">{opportunite.accountNom}</p>
        {opportunite.statut === "GAGNEE" && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
            Gagnée
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-[#8891B0]">{typeOpportuniteLabel[opportunite.type]}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-[#5C6584]">
        <span>{opportunite.proprietaire ?? "—"}</span>
        {montant && <span className="font-medium text-[#1B2340]">{montant}</span>}
      </div>
      {opportunite.probabilitePct !== undefined && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#EEF0FC]">
          <div className="h-full rounded-full bg-[#3333CE]" style={{ width: `${opportunite.probabilitePct}%` }} />
        </div>
      )}
    </Link>
  );
}

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const { segment } = await searchParams;
  const activeSegment: Segment = segment === "ENTREPRISE_QVT" ? "ENTREPRISE_QVT" : "PARTENAIRE";

  const opportunites = mockOpportunites.filter((o) => o.segment === activeSegment);
  const etapes: string[] = activeSegment === "PARTENAIRE" ? ETAPES_PARTENAIRE : ETAPES_QVT;
  const etapeLabel: Record<string, string> = {
    ...etapePipelinePartenaireLabel,
    ...etapePipelineQvtLabel,
  };

  const totalEnCours = opportunites.filter((o) => o.statut === "EN_COURS");
  const totalPondere = totalEnCours.reduce(
    (sum, o) => sum + ((o.montantEstimeAnnuel ?? 0) * (o.probabilitePct ?? 0)) / 100,
    0
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] px-6 py-8">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1B2340]">Pipeline & Opportunités</h1>
          <p className="text-sm text-[#5C6584]">
            {activeSegment === "PARTENAIRE"
              ? "Le parcours réel de l'Activation Manager — Découverte à Ambassadeur."
              : "Signature et renouvellement des contrats QVT."}
          </p>
        </div>
        <p className="text-sm text-[#5C6584]">
          {totalEnCours.length} en cours · pondéré{" "}
          <span className="font-semibold text-[#1B2340]">{formatMontant(totalPondere)}</span>
        </p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-[#E4E7F5]">
        {[
          { key: "PARTENAIRE" as Segment, label: "Partenaires" },
          { key: "ENTREPRISE_QVT" as Segment, label: "Entreprises QVT" },
        ].map((tab) => (
          <Link
            key={tab.key}
            href={`/pipeline?segment=${tab.key}`}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeSegment === tab.key
                ? "border-[#3333CE] text-[#3333CE]"
                : "border-transparent text-[#5C6584] hover:text-[#1B2340]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:flex lg:gap-4">
        {etapes.map((etape) => {
          const opportunitesEtape = opportunites.filter((o) =>
            activeSegment === "PARTENAIRE" ? o.etapePartenaire === etape : o.etapeQvt === etape
          );
          return (
            <div key={etape} className="flex min-w-[220px] flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#8891B0]">
                  {etapeLabel[etape]}
                </span>
                <span className="text-xs text-[#8891B0]">{opportunitesEtape.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {opportunitesEtape.map((opportunite) => (
                  <OpportuniteCard key={opportunite.id} opportunite={opportunite} />
                ))}
                {opportunitesEtape.length === 0 && (
                  <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">
                    Aucune opportunité
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
