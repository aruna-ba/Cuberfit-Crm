import Link from "next/link";
import { mockTemplates } from "@/lib/communications";
import { segmentLabel, phaseLifecycleLabel, canalCommunicationLabel } from "@/lib/labels";

export default function TemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1B2340]">Templates de communication</h1>
          <p className="text-sm text-[#5C6584]">
            Un template par segment et/ou phase de lifecycle — réutilisés par les campagnes et les
            relances automatiques des playbooks.
          </p>
        </div>
        <Link
          href="/campagnes"
          className="rounded-md border border-[#E4E7F5] bg-white px-3 py-1.5 text-sm font-medium text-[#5C6584] hover:bg-[#F9FAFE]"
        >
          Voir les campagnes
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {mockTemplates.map((template) => (
          <div key={template.id} className="rounded-lg border border-[#E4E7F5] bg-white p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[#1B2340]">{template.nom}</h2>
              <div className="flex gap-1.5">
                <span className="rounded-full bg-[#F1F2FA] px-2 py-0.5 text-xs text-[#5C6584]">
                  {canalCommunicationLabel[template.canal]}
                </span>
                <span className="rounded-full bg-[#F1F2FA] px-2 py-0.5 text-xs text-[#5C6584]">
                  {template.segment ? segmentLabel[template.segment] : "Tous segments"}
                </span>
                {template.phase && (
                  <span className="rounded-full bg-[#F1F2FA] px-2 py-0.5 text-xs text-[#5C6584]">
                    {phaseLifecycleLabel[template.phase]}
                  </span>
                )}
                {!template.actif && (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">Inactif</span>
                )}
              </div>
            </div>
            {template.sujet && (
              <p className="text-sm font-medium text-[#5C6584]">Sujet : {template.sujet}</p>
            )}
            <p className="mt-1 text-sm text-[#5C6584]">{template.corps}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
