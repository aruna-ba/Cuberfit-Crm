import Link from "next/link";
import { mockAccounts } from "@/lib/mock-data";
import { mockTickets, getSlaInfo } from "@/lib/tickets";
import { mockCampagnes } from "@/lib/communications";
import { mockOpportunites } from "@/lib/opportunites";
import { getAlertesActives } from "@/lib/kpis";
import { getVerbatimsNonTraites } from "@/lib/feedback";
import {
  segmentLabel,
  prioriteTicketLabel,
  statutTicketLabel,
  canalCommunicationLabel,
} from "@/lib/labels";
import { Card, RisqueScoreBadge, CampagneStatutBadge } from "@/components/ui";
import type { Segment, StatutRisqueScore } from "@/generated/prisma/enums";

const SEGMENTS: Segment[] = ["PASSIONNE", "PARTENAIRE", "ENTREPRISE_QVT"];
const STATUTS: StatutRisqueScore[] = ["VERT", "ORANGE", "ROUGE"];
const STATUT_DOT: Record<StatutRisqueScore, string> = {
  VERT: "bg-emerald-500",
  ORANGE: "bg-amber-500",
  ROUGE: "bg-red-500",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function DashboardPage() {
  const now = new Date();

  const comptesParSegment = SEGMENTS.map((segment) => ({
    segment,
    count: mockAccounts.filter((a) => a.segment === segment).length,
  }));

  const scored = mockAccounts.filter((a) => a.risqueScoreStatut !== undefined);
  const repartitionRisque = STATUTS.map((statut) => ({
    statut,
    count: scored.filter((a) => a.risqueScoreStatut === statut).length,
  }));
  const comptesRouges = scored
    .filter((a) => a.risqueScoreStatut === "ROUGE")
    .sort((a, b) => (a.risqueScoreActuel ?? 0) - (b.risqueScoreActuel ?? 0))
    .slice(0, 4);

  const ticketsActifs = mockTickets.filter((t) => t.statut !== "RESOLU" && t.statut !== "FERME");
  const ticketsPrioritaires = ticketsActifs
    .map((t) => ({ ticket: t, sla: getSlaInfo(t, now) }))
    .sort((a, b) => {
      if (a.sla.overdue !== b.sla.overdue) return a.sla.overdue ? -1 : 1;
      return a.ticket.dateCreation < b.ticket.dateCreation ? -1 : 1;
    })
    .slice(0, 4);

  const actionsEnAttente = mockAccounts
    .flatMap((account) =>
      account.playbookExecutions
        .filter((exec) => exec.statut === "EN_COURS")
        .flatMap((exec) =>
          exec.etapes
            .filter((etape) => etape.statut === "A_FAIRE")
            .map((etape) => ({ account, playbookNom: exec.playbookNom, etape }))
        )
    )
    .sort((a, b) => (a.etape.dateEcheance < b.etape.dateEcheance ? -1 : 1))
    .slice(0, 4);

  const dernieresCampagnes = [...mockCampagnes]
    .sort((a, b) => (a.dateCreation < b.dateCreation ? 1 : -1))
    .slice(0, 4);

  const opportunitesEnCours = mockOpportunites.filter((o) => o.statut === "EN_COURS");
  const pipelinePondere = opportunitesEnCours.reduce(
    (sum, o) => sum + ((o.montantEstimeAnnuel ?? 0) * (o.probabilitePct ?? 0)) / 100,
    0
  );
  const formatMontant = (montant: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(montant);

  const alertesKpi = getAlertesActives();
  const verbatimsNonTraites = getVerbatimsNonTraites();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2340]">Tableau de bord</h1>
        <p className="text-sm text-[#5C6584]">
          Vue d&apos;ensemble de l&apos;activité Cuberfit CRM — {mockAccounts.length} comptes,{" "}
          {ticketsActifs.length} ticket{ticketsActifs.length !== 1 ? "s" : ""} actif
          {ticketsActifs.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Cartes résumé */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {comptesParSegment.map(({ segment, count }) => (
          <Link
            key={segment}
            href={`/comptes?segment=${segment}`}
            className="rounded-lg border border-[#E4E7F5] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[#8891B0]">
              {segmentLabel[segment]}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#1B2340]">{count}</p>
            <p className="text-xs text-[#5C6584]">compte{count !== 1 ? "s" : ""}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pipeline */}
        <Card title="Pipeline">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-[#1B2340]">{opportunitesEnCours.length}</p>
              <p className="text-xs text-[#8891B0]">opportunité{opportunitesEnCours.length !== 1 ? "s" : ""} en cours</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-[#3333CE]">{formatMontant(pipelinePondere)}</p>
              <p className="text-xs text-[#8891B0]">pondéré</p>
            </div>
          </div>
          <Link href="/pipeline" className="mt-4 inline-block text-xs font-medium text-[#3333CE] hover:underline">
            Voir le pipeline →
          </Link>
        </Card>

        {/* Analytics & alertes KPI */}
        <Card title="KPIs & alertes">
          {alertesKpi.length === 0 ? (
            <p className="text-sm text-[#8891B0]">Tous les KPIs sont dans leur cible.</p>
          ) : (
            <>
              <p className="text-2xl font-semibold text-[#1B2340]">{alertesKpi.length}</p>
              <p className="text-xs text-[#8891B0]">
                KPI{alertesKpi.length !== 1 ? "s" : ""} sous leur cible, tous segments confondus
              </p>
            </>
          )}
          <Link href="/analytics" className="mt-4 inline-block text-xs font-medium text-[#3333CE] hover:underline">
            Voir les dashboards →
          </Link>
        </Card>

        {/* NPS & feedback */}
        <Card title="NPS & feedback">
          {verbatimsNonTraites.length === 0 ? (
            <p className="text-sm text-[#8891B0]">Aucun verbatim en attente de traitement.</p>
          ) : (
            <>
              <p className="text-2xl font-semibold text-[#1B2340]">{verbatimsNonTraites.length}</p>
              <p className="text-xs text-[#8891B0]">
                verbatim{verbatimsNonTraites.length !== 1 ? "s" : ""} nouveau
                {verbatimsNonTraites.length !== 1 ? "x" : ""} à traiter
              </p>
            </>
          )}
          <Link href="/feedback" className="mt-4 inline-block text-xs font-medium text-[#3333CE] hover:underline">
            Voir le feedback →
          </Link>
        </Card>

        {/* Score de risque */}
        <Card title="Score de risque">
          <div className="flex items-center gap-4">
            {repartitionRisque.map(({ statut, count }) => (
              <div key={statut} className="flex items-center gap-1.5 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUT_DOT[statut]}`} />
                <span className="font-medium text-[#1B2340]">{count}</span>
              </div>
            ))}
            <Link href="/score-de-risque" className="ml-auto text-xs font-medium text-[#3333CE] hover:underline">
              Voir le dashboard →
            </Link>
          </div>
          {comptesRouges.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2 border-t border-[#EEF0FC] pt-3">
              {comptesRouges.map((account) => (
                <li key={account.id} className="flex items-center justify-between text-sm">
                  <Link href={`/comptes/${account.id}`} className="text-[#1B2340] hover:underline">
                    {account.nom}
                  </Link>
                  <RisqueScoreBadge score={account.risqueScoreActuel} statut={account.risqueScoreStatut} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Tickets prioritaires */}
        <Card title="Tickets à traiter">
          {ticketsPrioritaires.length === 0 ? (
            <p className="text-sm text-[#8891B0]">Aucun ticket actif.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {ticketsPrioritaires.map(({ ticket, sla }) => (
                <li key={ticket.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <Link href={`/tickets/${ticket.id}`} className="block truncate text-[#1B2340] hover:underline">
                      #{ticket.numero} — {ticket.sujet}
                    </Link>
                    <p className="text-xs text-[#8891B0]">
                      {prioriteTicketLabel[ticket.priorite]} · {statutTicketLabel[ticket.statut]}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-medium ${sla.overdue ? "text-red-600" : "text-[#5C6584]"}`}>
                    {sla.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/tickets" className="mt-3 inline-block text-xs font-medium text-[#3333CE] hover:underline">
            Voir tous les tickets →
          </Link>
        </Card>

        {/* Actions playbook en attente */}
        <Card title="Actions en attente">
          {actionsEnAttente.length === 0 ? (
            <p className="text-sm text-[#8891B0]">Aucune action en attente.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {actionsEnAttente.map(({ account, playbookNom, etape }) => (
                <li key={etape.id} className="text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/comptes/${account.id}`} className="truncate text-[#1B2340] hover:underline">
                      {account.nom}
                    </Link>
                    <span className="shrink-0 text-xs text-[#8891B0]">échéance {formatDate(etape.dateEcheance)}</span>
                  </div>
                  <p className="text-xs text-[#5C6584]">
                    {playbookNom} — {etape.titre}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/lifecycle" className="mt-3 inline-block text-xs font-medium text-[#3333CE] hover:underline">
            Voir onboarding & lifecycle →
          </Link>
        </Card>

        {/* Dernières campagnes */}
        <Card title="Dernières campagnes">
          <ul className="flex flex-col gap-2.5">
            {dernieresCampagnes.map((campagne) => (
              <li key={campagne.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <Link href={`/campagnes/${campagne.id}`} className="block truncate text-[#1B2340] hover:underline">
                    {campagne.nom}
                  </Link>
                  <p className="text-xs text-[#8891B0]">
                    {canalCommunicationLabel[campagne.canal]}
                    {campagne.segmentCible ? ` · ${segmentLabel[campagne.segmentCible]}` : " · Tous segments"}
                  </p>
                </div>
                <CampagneStatutBadge statut={campagne.statut} />
              </li>
            ))}
          </ul>
          <Link href="/campagnes" className="mt-3 inline-block text-xs font-medium text-[#3333CE] hover:underline">
            Voir toutes les campagnes →
          </Link>
        </Card>
      </div>
    </div>
  );
}
