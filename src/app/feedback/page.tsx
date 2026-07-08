import Link from "next/link";
import { getAllReponses, getNpsParSegment, categoriserScore, type NpsSegmentSummary } from "@/lib/feedback";
import {
  segmentLabel,
  statutTraitementVerbatimLabel,
  statutTraitementVerbatimBadgeClass,
  categorieNpsLabel,
  categorieNpsBadgeClass,
} from "@/lib/labels";
import { Card } from "@/components/ui";
import type { Segment } from "@/generated/prisma/enums";

const SEGMENTS: Segment[] = ["PASSIONNE", "PARTENAIRE", "ENTREPRISE_QVT"];

const STATUT_ORDRE: Record<string, number> = { NOUVEAU: 0, EN_COURS: 1, TRAITE: 2 };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function NpsSegmentCard({ segment, resume }: { segment: Segment; resume?: NpsSegmentSummary }) {
  if (!resume) {
    return (
      <div className="rounded-lg border border-[#E4E7F5] bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8891B0]">{segmentLabel[segment]}</p>
        <p className="mt-2 text-sm text-[#8891B0]">Aucune réponse pour l&apos;instant.</p>
      </div>
    );
  }
  const { nps, nombreReponses, promoteurs, passifs, detracteurs } = resume;
  return (
    <div className="rounded-lg border border-[#E4E7F5] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[#8891B0]">{segmentLabel[segment]}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <p className={`text-2xl font-semibold ${nps >= 0 ? "text-[#1B2340]" : "text-red-500"}`}>{nps}</p>
        <p className="text-xs text-[#8891B0]">{nombreReponses} réponse{nombreReponses !== 1 ? "s" : ""}</p>
      </div>
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-[#EEF0FC]">
        <div className="h-full bg-emerald-500" style={{ width: `${(promoteurs / nombreReponses) * 100}%` }} />
        <div className="h-full bg-slate-300" style={{ width: `${(passifs / nombreReponses) * 100}%` }} />
        <div className="h-full bg-red-500" style={{ width: `${(detracteurs / nombreReponses) * 100}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#8891B0]">
        <span>{promoteurs} promoteurs</span>
        <span>{passifs} passifs</span>
        <span>{detracteurs} détracteurs</span>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const toutesReponses = getAllReponses();
  const reponsesAvecVerbatim = toutesReponses
    .filter((r) => r.verbatim)
    .sort((a, b) => {
      const ordre = STATUT_ORDRE[a.statutTraitement] - STATUT_ORDRE[b.statutTraitement];
      if (ordre !== 0) return ordre;
      return a.dateReponse < b.dateReponse ? 1 : -1;
    });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2340]">NPS & feedback</h1>
        <p className="text-sm text-[#5C6584]">
          Enquêtes de satisfaction par segment, verbatims et boucle produit — {toutesReponses.length} réponses
          collectées.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SEGMENTS.map((segment) => (
          <NpsSegmentCard key={segment} segment={segment} resume={getNpsParSegment(segment)} />
        ))}
      </div>

      <Card title="Boucle produit — verbatims">
        {reponsesAvecVerbatim.length === 0 ? (
          <p className="text-sm text-[#8891B0]">Aucun verbatim pour l&apos;instant.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-[#EEF0FC]">
            {reponsesAvecVerbatim.map((reponse) => {
              const categorie = categoriserScore(reponse.score);
              return (
                <li key={reponse.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${categorieNpsBadgeClass[categorie]}`}
                      >
                        <span className="font-semibold">{reponse.score}</span>
                        <span>· {categorieNpsLabel[categorie]}</span>
                      </span>
                      <Link href={`/comptes/${reponse.accountId}`} className="text-sm font-medium text-[#1B2340] hover:underline">
                        {reponse.accountNom}
                      </Link>
                      <span className="text-xs text-[#8891B0]">{segmentLabel[reponse.segment]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8891B0]">{formatDate(reponse.dateReponse)}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statutTraitementVerbatimBadgeClass[reponse.statutTraitement]}`}
                      >
                        {statutTraitementVerbatimLabel[reponse.statutTraitement]}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#5C6584]">&ldquo;{reponse.verbatim}&rdquo;</p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
