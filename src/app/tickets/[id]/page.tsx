import Link from "next/link";
import { notFound } from "next/navigation";
import { getTicketById, getSlaInfo, aUneSlaStandard, getEcheancePremiereReponse, getEcheanceResolution } from "@/lib/tickets";
import {
  prioriteTicketLabel,
  prioriteTicketBadgeClass,
  statutTicketLabel,
  statutTicketBadgeClass,
  canalEntreeTicketLabel,
  origineTicketLabel,
} from "@/lib/labels";
import { Card, Field } from "@/components/ui";

function formatDateTime(iso?: string | Date) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = getTicketById(id);
  if (!ticket) notFound();

  const now = new Date();
  const sla = getSlaInfo(ticket, now);
  const echeancePremiereReponse = getEcheancePremiereReponse(ticket);
  const echeanceResolution = getEcheanceResolution(ticket);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <Link href="/tickets" className="text-sm text-[#5C6584] hover:text-[#1B2340]">
        ← Retour aux tickets
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#8891B0]">#{ticket.numero}</p>
          <h1 className="text-2xl font-semibold text-[#1B2340]">{ticket.sujet}</h1>
          <p className="mt-1 text-sm text-[#5C6584]">
            <Link href={`/comptes/${ticket.accountId}`} className="hover:underline">
              {ticket.accountNom}
            </Link>{" "}
            · {canalEntreeTicketLabel[ticket.canalEntree]} · {origineTicketLabel[ticket.origine]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${prioriteTicketBadgeClass[ticket.priorite]}`}>
            {prioriteTicketLabel[ticket.priorite]}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statutTicketBadgeClass[ticket.statut]}`}>
            {statutTicketLabel[ticket.statut]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Détails" className="lg:col-span-2">
          {ticket.description && <p className="mb-4 text-sm text-[#5C6584]">{ticket.description}</p>}
          <dl className="divide-y divide-[#EEF0FC]">
            <Field label="Assigné à" value={ticket.assigneA} />
            <Field label="Créé le" value={formatDateTime(ticket.dateCreation)} />
            <Field label="1ère réponse" value={formatDateTime(ticket.datePremiereReponse)} />
            <Field label="Résolu le" value={formatDateTime(ticket.dateResolution)} />
          </dl>
        </Card>

        <Card title="SLA">
          <p className={`text-sm font-medium ${sla.overdue ? "text-red-600" : "text-[#5C6584]"}`}>{sla.label}</p>
          {aUneSlaStandard(ticket) ? (
            <dl className="mt-3 divide-y divide-[#EEF0FC]">
              <Field label="Échéance 1ère réponse" value={formatDateTime(echeancePremiereReponse ?? undefined)} />
              <Field label="Échéance résolution" value={formatDateTime(echeanceResolution ?? undefined)} />
            </dl>
          ) : (
            <p className="mt-2 text-xs text-[#8891B0]">
              {ticket.priorite === "URGENTE"
                ? "Priorité urgente : hors SLA standard, traitement immédiat."
                : "Priorité basse : traitée via self-service en priorité, pas de SLA standard."}
            </p>
          )}
        </Card>
      </div>

      {(ticket.statut === "RESOLU" || ticket.statut === "FERME") && (
        <Card title="CSAT" className="mt-6">
          {ticket.csatScore ? (
            <div>
              <p className="text-lg font-semibold text-[#1B2340]">{ticket.csatScore}/5</p>
              {ticket.csatCommentaire && <p className="mt-1 text-sm text-[#5C6584]">{ticket.csatCommentaire}</p>}
            </div>
          ) : (
            <p className="text-sm text-[#8891B0]">Pas de retour CSAT pour ce ticket.</p>
          )}
        </Card>
      )}
    </div>
  );
}
