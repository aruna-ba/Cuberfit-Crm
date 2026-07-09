import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampagneById } from "@/lib/communications";
import { segmentLabel, phaseLifecycleLabel, canalCommunicationLabel, statutEnvoiCampagneLabel } from "@/lib/labels";
import { Card, CampagneStatutBadge, Field } from "@/components/ui";
import type { StatutEnvoiCampagne } from "@/generated/prisma/enums";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUTS_ENVOI: StatutEnvoiCampagne[] = ["EN_ATTENTE", "ENVOYE", "LIVRE", "LU", "CLIQUE", "ECHEC"];

export default async function CampagneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campagne = getCampagneById(id);
  if (!campagne) notFound();

  const total = campagne.envois.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <Link href="/campagnes" className="text-sm text-[#5C6584] hover:text-[#1B2340]">
        ← Retour aux campagnes
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1B2340]">{campagne.nom}</h1>
          {campagne.description && <p className="text-sm text-[#5C6584]">{campagne.description}</p>}
        </div>
        <CampagneStatutBadge statut={campagne.statut} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Détails">
          <dl className="divide-y divide-[#EEF0FC]">
            <Field
              label="Cible"
              value={campagne.segmentCible ? segmentLabel[campagne.segmentCible] : "Tous segments"}
            />
            <Field
              label="Phase lifecycle"
              value={campagne.phaseCible ? phaseLifecycleLabel[campagne.phaseCible] : "—"}
            />
            <Field label="Canal" value={canalCommunicationLabel[campagne.canal]} />
            <Field label="Template utilisé" value={campagne.templateNom} />
            <Field label="Date de création" value={formatDate(campagne.dateCreation)} />
            <Field label="Date planifiée" value={formatDate(campagne.datePlanifiee)} />
            <Field label="Date d'envoi" value={formatDate(campagne.dateEnvoi)} />
          </dl>
        </Card>

        <Card title="Performance par statut" className="lg:col-span-2">
          {total === 0 ? (
            <p className="text-sm text-[#8891B0]">Campagne pas encore envoyée.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {STATUTS_ENVOI.map((statut) => {
                const count = campagne.envois.filter((e) => e.statut === statut).length;
                if (count === 0) return null;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={statut} className="rounded-md border border-[#EEF0FC] p-3">
                    <p className="text-xs text-[#5C6584]">{statutEnvoiCampagneLabel[statut]}</p>
                    <p className="text-lg font-semibold text-[#1B2340]">
                      {count} <span className="text-xs font-normal text-[#8891B0]">({pct}%)</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card title={`Envois (${total})`} className="mt-6">
        {total === 0 ? (
          <p className="text-sm text-[#8891B0]">Aucun envoi pour l&apos;instant.</p>
        ) : (
          <div className="overflow-hidden rounded-md border border-[#EEF0FC]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#EEF0FC] bg-[#F9FAFE] text-xs uppercase tracking-wide text-[#5C6584]">
                <tr>
                  <th className="px-4 py-2 font-medium">Compte</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                  <th className="px-4 py-2 font-medium">Envoyé le</th>
                  <th className="px-4 py-2 font-medium">Lu le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0FC]">
                {campagne.envois.map((envoi) => (
                  <tr key={envoi.id}>
                    <td className="px-4 py-2">
                      <Link href={`/comptes/${envoi.accountId}`} className="text-[#1B2340] hover:underline">
                        {envoi.accountNom}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-[#5C6584]">{statutEnvoiCampagneLabel[envoi.statut]}</td>
                    <td className="px-4 py-2 text-[#5C6584]">{formatDate(envoi.dateEnvoi)}</td>
                    <td className="px-4 py-2 text-[#5C6584]">{formatDate(envoi.dateLecture)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
