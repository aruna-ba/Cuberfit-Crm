import Link from "next/link";
import { mockTickets, getSlaInfo } from "@/lib/tickets";
import {
  prioriteTicketLabel,
  statutTicketLabel,
  canalEntreeTicketLabel,
  origineTicketLabel,
} from "@/lib/labels";
import type { PrioriteTicket } from "@/generated/prisma/enums";

const PRIORITES: PrioriteTicket[] = ["URGENTE", "HAUTE", "MOYENNE", "BASSE"];

const PRIORITE_DOT: Record<PrioriteTicket, string> = {
  URGENTE: "bg-red-500",
  HAUTE: "bg-amber-500",
  MOYENNE: "bg-sky-500",
  BASSE: "bg-slate-400",
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ priorite?: string }>;
}) {
  const { priorite } = await searchParams;
  const activePriorite = (priorite as PrioriteTicket | undefined) ?? undefined;
  const now = new Date();

  const tickets = mockTickets
    .filter((t) => !activePriorite || t.priorite === activePriorite)
    .map((t) => ({ ticket: t, sla: getSlaInfo(t, now) }))
    .sort((a, b) => {
      if (a.sla.overdue !== b.sla.overdue) return a.sla.overdue ? -1 : 1;
      return a.ticket.dateCreation < b.ticket.dateCreation ? -1 : 1;
    });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Tickets & support</h1>
        <p className="text-sm text-slate-500">
          1ère réponse &lt; 4h ouvrées · résolution standard 24-48h · agent vocal cible ≈80% de
          résolution en autonomie.
        </p>
      </div>

      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {[{ key: undefined, label: "Toutes priorités" }, ...PRIORITES.map((p) => ({ key: p, label: prioriteTicketLabel[p] }))].map(
          (tab) => {
            const isActive = tab.key === activePriorite;
            const href = tab.key ? `/tickets?priorite=${tab.key}` : "/tickets";
            return (
              <Link
                key={tab.label}
                href={href}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                  isActive ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </Link>
            );
          }
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Sujet</th>
              <th className="px-4 py-3 font-medium">Compte</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Priorité</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Origine</th>
              <th className="px-4 py-3 font-medium">SLA restant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(({ ticket, sla }) => (
              <tr key={ticket.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400">#{ticket.numero}</td>
                <td className="px-4 py-3">
                  <Link href={`/tickets/${ticket.id}`} className="font-medium text-slate-900 hover:underline">
                    {ticket.sujet}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/comptes/${ticket.accountId}`} className="text-slate-600 hover:underline">
                    {ticket.accountNom}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{canalEntreeTicketLabel[ticket.canalEntree]}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${PRIORITE_DOT[ticket.priorite]}`} />
                    {prioriteTicketLabel[ticket.priorite]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{statutTicketLabel[ticket.statut]}</td>
                <td className="px-4 py-3 text-slate-600">{origineTicketLabel[ticket.origine]}</td>
                <td className={`px-4 py-3 font-medium ${sla.overdue ? "text-red-600" : sla.muted ? "text-slate-400" : "text-slate-700"}`}>
                  {sla.label}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  Aucun ticket ne correspond à ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
