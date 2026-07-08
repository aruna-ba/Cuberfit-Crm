import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpportuniteById } from "@/lib/opportunites";
import {
  segmentLabel,
  typeOpportuniteLabel,
  statutOpportuniteLabel,
  etapePipelinePartenaireLabel,
  etapePipelineQvtLabel,
} from "@/lib/labels";
import { Card, Field } from "@/components/ui";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatMontant(montant?: number) {
  if (montant === undefined) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    montant
  );
}

const STATUT_BADGE: Record<string, string> = {
  EN_COURS: "bg-sky-100 text-sky-800 ring-sky-600/20",
  GAGNEE: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  PERDUE: "bg-slate-100 text-slate-500 ring-slate-600/20",
};

export default async function OpportuniteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunite = getOpportuniteById(id);
  if (!opportunite) notFound();

  const etapeLabel =
    opportunite.segment === "PARTENAIRE"
      ? opportunite.etapePartenaire
        ? etapePipelinePartenaireLabel[opportunite.etapePartenaire]
        : "—"
      : opportunite.etapeQvt
        ? etapePipelineQvtLabel[opportunite.etapeQvt]
        : "—";

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <Link href="/pipeline" className="text-sm text-[#5C6584] hover:text-[#1B2340]">
        ← Retour au pipeline
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1B2340]">{opportunite.accountNom}</h1>
          <p className="text-sm text-[#5C6584]">
            {segmentLabel[opportunite.segment]} · {typeOpportuniteLabel[opportunite.type]}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUT_BADGE[opportunite.statut]}`}
        >
          {statutOpportuniteLabel[opportunite.statut]}
        </span>
      </div>

      <Card title="Détails">
        <dl className="divide-y divide-slate-100">
          <Field label="Compte" value={<Link href={`/comptes/${opportunite.accountId}`} className="hover:underline">{opportunite.accountNom}</Link>} />
          <Field label="Étape" value={etapeLabel} />
          <Field label="Montant estimé (annuel)" value={formatMontant(opportunite.montantEstimeAnnuel)} />
          <Field label="Probabilité" value={opportunite.probabilitePct !== undefined ? `${opportunite.probabilitePct}%` : "—"} />
          <Field label="Propriétaire" value={opportunite.proprietaire} />
          <Field label="Date de création" value={formatDate(opportunite.dateCreation)} />
          <Field label="Clôture prévue" value={formatDate(opportunite.dateClotureprevue)} />
          <Field label="Clôturée le" value={formatDate(opportunite.dateCloture)} />
        </dl>
      </Card>
    </div>
  );
}
