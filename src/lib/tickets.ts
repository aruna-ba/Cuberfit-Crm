import type { TicketVM } from "@/lib/types";
import { SLA_TICKET } from "@/lib/labels";

/**
 * Données de démonstration pour le module P0-5 (Tickets & support).
 * À remplacer par de vraies requêtes Prisma une fois la base Postgres branchée.
 */
export const mockTickets: TicketVM[] = [
  {
    id: "tkt_1",
    numero: 1042,
    accountId: "acc_passionne_2",
    accountNom: "Ibrahima Ndiaye",
    sujet: "Paiement débité sans crédit reçu",
    description: "Le client indique avoir été débité de 5 000 XOF via Wave sans recevoir les crédits correspondants.",
    canalEntree: "WHATSAPP",
    priorite: "URGENTE",
    statut: "OUVERT",
    origine: "AUTO_AGENT_VOCAL",
    dateCreation: "2026-07-07T08:00:00",
  },
  {
    id: "tkt_2",
    numero: 1038,
    accountId: "acc_passionne_2",
    accountNom: "Ibrahima Ndiaye",
    sujet: "Litige avec le coach — séance annulée sans remboursement",
    canalEntree: "AGENT_VOCAL",
    priorite: "HAUTE",
    statut: "EN_COURS",
    origine: "AUTO_AGENT_VOCAL",
    assigneA: "Fatou Sakho",
    dateCreation: "2026-06-18T09:00:00",
    datePremiereReponse: "2026-06-18T11:30:00",
  },
  {
    id: "tkt_3",
    numero: 1051,
    accountId: "acc_passionne_3",
    accountNom: "Moussa Diagne",
    sujet: "Question sur crédits dormants",
    canalEntree: "EMAIL",
    priorite: "MOYENNE",
    statut: "RESOLU",
    origine: "MANUEL",
    assigneA: "Fatou Sakho",
    dateCreation: "2026-07-05T09:00:00",
    datePremiereReponse: "2026-07-05T11:00:00",
    dateResolution: "2026-07-06T15:00:00",
    csatScore: 5,
    csatCommentaire: "Réponse rapide et claire, merci !",
  },
  {
    id: "tkt_4",
    numero: 1029,
    accountId: "acc_passionne_1",
    accountNom: "Aïssatou Diop",
    sujet: "Suggestion : ajouter un mode sombre à l'app",
    canalEntree: "APP_MOBILE",
    priorite: "BASSE",
    statut: "FERME",
    origine: "MANUEL",
    dateCreation: "2026-06-25T10:00:00",
    datePremiereReponse: "2026-06-26T09:00:00",
    dateResolution: "2026-06-27T09:00:00",
    csatScore: 4,
  },
  {
    id: "tkt_5",
    numero: 1055,
    accountId: "acc_partenaire_2",
    accountNom: "Coach Moussa Fall",
    sujet: "Retard de paiement sur les réservations du mois",
    canalEntree: "EMAIL",
    priorite: "HAUTE",
    statut: "OUVERT",
    origine: "MANUEL",
    dateCreation: "2026-07-06T10:00:00",
  },
  {
    id: "tkt_6",
    numero: 1049,
    accountId: "acc_entreprise_2",
    accountNom: "Teranga Assurances",
    sujet: "Modification de l'interlocuteur RH principal",
    canalEntree: "EMAIL",
    priorite: "MOYENNE",
    statut: "EN_ATTENTE_CLIENT",
    origine: "MANUEL",
    assigneA: "Harouna Ba",
    dateCreation: "2026-07-04T09:00:00",
    datePremiereReponse: "2026-07-04T14:00:00",
  },
  {
    id: "tkt_7",
    numero: 1056,
    accountId: "acc_passionne_1",
    accountNom: "Aïssatou Diop",
    sujet: "Signalement : donnée de santé Bloom potentiellement exposée",
    description: "Le client a vu apparaître des données de suivi de cycle qui ne lui semblent pas correctes dans son profil.",
    canalEntree: "APP_MOBILE",
    priorite: "URGENTE",
    statut: "EN_COURS",
    origine: "MANUEL",
    assigneA: "Harouna Ba",
    dateCreation: "2026-07-07T08:00:00",
    datePremiereReponse: "2026-07-07T08:15:00",
  },
];

export function getTicketById(id: string): TicketVM | undefined {
  return mockTickets.find((t) => t.id === id);
}

export function getTicketsByAccountId(accountId: string): TicketVM[] {
  return mockTickets.filter((t) => t.accountId === accountId);
}

/**
 * L'échéance de 1ère réponse / résolution ne s'applique pas aux priorités
 * Urgente (traitement immédiat, hors SLA standard) et Basse (self-service
 * en priorité) — cf. tableau des priorités du module P0-5.
 */
export function aUneSlaStandard(ticket: TicketVM): boolean {
  return ticket.priorite === "HAUTE" || ticket.priorite === "MOYENNE";
}

export function getEcheancePremiereReponse(ticket: TicketVM): Date | null {
  if (!aUneSlaStandard(ticket)) return null;
  return new Date(new Date(ticket.dateCreation).getTime() + SLA_TICKET.PREMIERE_REPONSE_HEURES * 3_600_000);
}

export function getEcheanceResolution(ticket: TicketVM): Date | null {
  if (!aUneSlaStandard(ticket)) return null;
  return new Date(new Date(ticket.dateCreation).getTime() + SLA_TICKET.RESOLUTION_HEURES_MAX * 3_600_000);
}

export type SlaInfo = { label: string; overdue: boolean; muted?: boolean };

export function getSlaInfo(ticket: TicketVM, now: Date): SlaInfo {
  if (ticket.statut === "RESOLU" || ticket.statut === "FERME") {
    return { label: "Clôturé", overdue: false, muted: true };
  }
  if (ticket.priorite === "URGENTE") {
    return { label: "Traitement immédiat", overdue: ticket.statut === "OUVERT", muted: false };
  }
  if (ticket.priorite === "BASSE") {
    return { label: "Self-service", overdue: false, muted: true };
  }

  const cible = ticket.datePremiereReponse ? getEcheanceResolution(ticket) : getEcheancePremiereReponse(ticket);
  const label = ticket.datePremiereReponse ? "Résolution" : "1ère réponse";
  if (!cible) return { label: "—", overdue: false, muted: true };

  const diffHeures = (cible.getTime() - now.getTime()) / 3_600_000;
  if (diffHeures < 0) {
    return { label: `${label} en retard de ${Math.abs(Math.round(diffHeures))}h`, overdue: true };
  }
  return { label: `${label} : ${Math.round(diffHeures)}h restantes`, overdue: false };
}
