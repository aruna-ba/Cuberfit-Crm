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
          <h1 className="text-xl font-semibold text-[#1B2340]">Campagnes</h1>
          <p className="text-sm text-[#5C6584]">
            Campagnes multicanal par segment et phase de lifecycle.
          </p>
        </div>
        <Link
          href="/templates"
          className="rounded-md border border-[#E4E7F5] bg-white px-3 py-1.5 text-sm font-medium text-[#5C6584] hover:bg-[#F9FAFE]"
        >
          Voir les templates
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E4E7F5] bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E4E7F5] bg-[#F9FAFE] text-xs uppercase tracking-wide text-[#5C6584]">
            <tr>
              <th className="px-4 py-3 font-medium">Campagne</th>
              <th className="px-4 py-3 font-medium">Cible</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF0FC]">
            {mockCampagnes.map((campagne) => {
              const lus = campagne.envois.filter((e) => e.statut === "LU" || e.statut === "CLIQUE").length;
              return (
                <tr key={campagne.id} className="hover:bg-[#F9FAFE]">
                  <td className="px-4 py-3">
                    <Link href={`/campagnes/${campagne.id}`} className="font-medium text-[#1B2340] hover:underline">
                      {campagne.nom}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#5C6584]">
                    {campagne.segmentCible ? segmentLabel[campagne.segmentCible] : "Tous segments"}
                    {campagne.phaseCible ? ` · ${phaseLifecycleLabel[campagne.phaseCible]}` : ""}
                  </td>
                  <td className="px-4 py-3 text-[#5C6584]">{canalCommunicationLabel[campagne.canal]}</td>
                  <td className="px-4 py-3">
                    <CampagneStatutBadge statut={campagne.statut} />
                  </td>
                  <td className="px-4 py-3 text-[#5C6584]">
                    {formatDate(campagne.dateEnvoi ?? campagne.datePlanifiee)}
                  </td>
                  <td className="px-4 py-3 text-[#5C6584]">
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
