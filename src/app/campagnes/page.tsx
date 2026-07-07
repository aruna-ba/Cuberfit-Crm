import Link from "next/link";
import { mockCampagnes } from "@/lib/communications";
import { segmentLabel, phaseLifecycleLabel, canalCommunicationLabel } from "@/lib/labels";
import { CampagneStatutBadge } from "@/components/ui";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CampagnesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Campagnes</h1>
          <p className="text-sm text-slate-500">
            Campagnes multicanal par segment et phase de lifecycle.
          </p>
        </div>
        <Link
          href="/templates"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Voir les templates
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Campagne</th>
              <th className="px-4 py-3 font-medium">Cible</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockCampagnes.map((campagne) => {
              const lus = campagne.envois.filter((e) => e.statut === "LU" || e.statut === "CLIQUE").length;
              return (
                <tr key={campagne.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/campagnes/${campagne.id}`} className="font-medium text-slate-900 hover:underline">
                      {campagne.nom}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {campagne.segmentCible ? segmentLabel[campagne.segmentCible] : "Tous segments"}
                    {campagne.phaseCible ? ` · ${phaseLifecycleLabel[campagne.phaseCible]}` : ""}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{canalCommunicationLabel[campagne.canal]}</td>
                  <td className="px-4 py-3">
                    <CampagneStatutBadge statut={campagne.statut} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(campagne.dateEnvoi ?? campagne.datePlanifiee)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {campagne.envois.length > 0
                      ? `${lus}/${campagne.envois.length} lu${lus !== 1 ? "s" : ""}`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
