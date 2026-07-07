import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccountById } from "@/lib/mock-data";
import {
  segmentLabel,
  phaseLifecycleLabel,
  statutAbonnementLabel,
  typeActivitePartenaireLabel,
  typeInteractionLabel,
  typeMomentDeVeriteLabel,
  statutPlaybookExecutionLabel,
  statutEtapePlaybookLabel,
  canalCommunicationLabel,
} from "@/lib/labels";
import { AccompagnementBadge, Card, Field, RisqueScoreBadge } from "@/components/ui";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDevise(montant?: number) {
  if (montant === undefined) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(montant);
}

export default async function CompteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = getAccountById(id);
  if (!account) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <Link href="/comptes" className="text-sm text-slate-500 hover:text-slate-700">
        ← Retour aux comptes
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{account.nom}</h1>
          <p className="text-sm text-slate-500">
            {segmentLabel[account.segment]} · {phaseLifecycleLabel[account.phaseLifecycle]} ·
            Compte créé le {formatDate(account.dateCreation)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AccompagnementBadge niveau={account.niveauAccompagnement} />
          <RisqueScoreBadge score={account.risqueScoreActuel} statut={account.risqueScoreStatut} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          {account.passionneProfile && (
            <Card title="Profil Passionné">
              <dl className="divide-y divide-slate-100">
                <Field label="Email" value={account.passionneProfile.email} />
                <Field label="Téléphone" value={account.passionneProfile.telephone} />
                <Field label="Ville" value={account.passionneProfile.ville} />
                <Field
                  label="Abonnement"
                  value={statutAbonnementLabel[account.passionneProfile.statutAbonnement]}
                />
                <Field
                  label="Crédits (achetés / consommés / dormants)"
                  value={`${account.passionneProfile.creditsAchetes} / ${account.passionneProfile.creditsConsommes} / ${account.passionneProfile.creditsDormants}`}
                />
                <Field
                  label="No-show / Annulations"
                  value={`${account.passionneProfile.nombreNoShow} / ${account.passionneProfile.nombreAnnulations}`}
                />
                <Field label="NPS" value={account.passionneProfile.npsScore} />
                <Field
                  label="Dernière activité"
                  value={formatDate(account.passionneProfile.dateDerniereActivite)}
                />
                <Field
                  label="Coach(s) associé(s)"
                  value={
                    account.passionneProfile.coachsAssocies.length
                      ? account.passionneProfile.coachsAssocies.map((c) => c.nom).join(", ")
                      : "Aucun"
                  }
                />
              </dl>
            </Card>
          )}

          {account.partenaireProfile && (
            <Card title="Profil Partenaire">
              <dl className="divide-y divide-slate-100">
                <Field
                  label="Type d'activité"
                  value={typeActivitePartenaireLabel[account.partenaireProfile.typeActivite]}
                />
                <Field label="Ville" value={account.partenaireProfile.ville} />
                <Field label="Adresse" value={account.partenaireProfile.adresse} />
                <Field
                  label="Complétude du profil"
                  value={`${account.partenaireProfile.statutProfilCompletudePct}%`}
                />
                <Field
                  label="Taux de remplissage moyen"
                  value={
                    account.partenaireProfile.tauxRemplissageMoyenPct !== undefined
                      ? `${account.partenaireProfile.tauxRemplissageMoyenPct}%`
                      : "—"
                  }
                />
                <Field
                  label="Réservations reçues (total)"
                  value={account.partenaireProfile.reservationsRecuesTotal}
                />
                <Field
                  label="Satisfaction partenaire"
                  value={
                    account.partenaireProfile.satisfactionScore !== undefined
                      ? `${account.partenaireProfile.satisfactionScore}/10`
                      : "—"
                  }
                />
                <Field label="Date de signature" value={formatDate(account.partenaireProfile.dateSignature)} />
              </dl>
            </Card>
          )}

          {account.entrepriseQvtProfile && (
            <Card title="Profil Entreprise QVT">
              <dl className="divide-y divide-slate-100">
                <Field label="Secteur" value={account.entrepriseQvtProfile.secteurActivite} />
                <Field label="Effectif" value={account.entrepriseQvtProfile.tailleEffectif} />
                <Field
                  label="Budget alloué / consommé"
                  value={`${formatDevise(account.entrepriseQvtProfile.budgetAllouAnnuel)} / ${formatDevise(
                    account.entrepriseQvtProfile.budgetConsommeAnnuel
                  )}`}
                />
                <Field
                  label="% employés activés"
                  value={
                    account.entrepriseQvtProfile.pctEmployesActives !== undefined
                      ? `${account.entrepriseQvtProfile.pctEmployesActives}%`
                      : "—"
                  }
                />
                <Field
                  label="% employés actifs mensuels"
                  value={
                    account.entrepriseQvtProfile.pctEmployesActifsMensuels !== undefined
                      ? `${account.entrepriseQvtProfile.pctEmployesActifsMensuels}%`
                      : "—"
                  }
                />
                <Field label="Date de signature" value={formatDate(account.entrepriseQvtProfile.dateSignature)} />
                <Field
                  label="Date de renouvellement"
                  value={formatDate(account.entrepriseQvtProfile.dateRenouvellement)}
                />
              </dl>
            </Card>
          )}

          <Card title={`Contacts (${account.contacts.length})`}>
            {account.contacts.length === 0 ? (
              <p className="text-sm text-slate-400">Aucun contact enregistré.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {account.contacts.map((contact) => (
                  <li key={contact.id} className="text-sm">
                    <div className="font-medium text-slate-900">
                      {contact.prenom} {contact.nom}
                      {contact.estContactPrincipal && (
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          Principal
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500">{contact.role}</div>
                    <div className="text-slate-500">{contact.email}</div>
                    <div className="text-slate-500">{contact.telephone}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Score de risque — évolution">
            {account.risqueScoreHistorique.length === 0 ? (
              <p className="text-sm text-slate-400">Aucun calcul disponible pour l&apos;instant.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {[...account.risqueScoreHistorique]
                  .sort((a, b) => (a.dateCalcul < b.dateCalcul ? 1 : -1))
                  .map((snapshot) => (
                    <li
                      key={snapshot.id}
                      className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2"
                    >
                      <span className="text-sm text-slate-500">{formatDate(snapshot.dateCalcul)}</span>
                      <RisqueScoreBadge score={snapshot.score} statut={snapshot.statut} />
                    </li>
                  ))}
              </ul>
            )}
          </Card>

          <Card title="Onboarding & lifecycle">
            {account.momentsDeVerite.length === 0 && account.playbookExecutions.length === 0 ? (
              <p className="text-sm text-slate-400">Aucun playbook actif pour ce compte.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {account.momentsDeVerite.length > 0 && (
                  <ul className="flex flex-col gap-1.5">
                    {account.momentsDeVerite.map((moment) => (
                      <li key={moment.id} className="flex items-center gap-2 text-sm">
                        <span className={moment.dateAtteint ? "text-emerald-600" : "text-slate-400"}>
                          {moment.dateAtteint ? "✓" : "○"}
                        </span>
                        <span className="text-slate-700">{typeMomentDeVeriteLabel[moment.type]}</span>
                        <span className="text-slate-400">
                          {moment.dateAtteint
                            ? `— atteint le ${formatDate(moment.dateAtteint)}`
                            : moment.dateCibleAvant
                              ? `— attendu avant le ${formatDate(moment.dateCibleAvant)}`
                              : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {account.playbookExecutions.map((execution) => (
                  <div key={execution.id} className="rounded-md border border-slate-100 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">{execution.playbookNom}</p>
                      <span className="text-xs text-slate-500">
                        {statutPlaybookExecutionLabel[execution.statut]}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {execution.etapes.map((etape) => (
                        <li key={etape.id} className="flex items-start gap-2 text-sm">
                          <span
                            className={
                              etape.statut === "FAITE"
                                ? "text-emerald-600"
                                : etape.statut === "IGNOREE"
                                  ? "text-slate-300"
                                  : "text-amber-500"
                            }
                          >
                            {etape.statut === "FAITE" ? "✓" : etape.statut === "IGNOREE" ? "–" : "○"}
                          </span>
                          <span className="text-slate-700">
                            {etape.titre}
                            {etape.canal !== "AUCUN" && (
                              <span className="text-slate-400"> · {canalCommunicationLabel[etape.canal]}</span>
                            )}
                            <span className="text-slate-400">
                              {" — "}
                              {statutEtapePlaybookLabel[etape.statut]}
                              {etape.dateRealisation
                                ? ` le ${formatDate(etape.dateRealisation)}`
                                : ` (échéance ${formatDate(etape.dateEcheance)})`}
                              {etape.assigneA ? ` · ${etape.assigneA}` : ""}
                              {etape.templateNom ? ` · template « ${etape.templateNom} »` : ""}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title={`Historique des interactions (Vue 360°) — ${account.interactions.length}`}>
            {account.interactions.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune interaction enregistrée.</p>
            ) : (
              <ol className="relative flex flex-col gap-5 border-l border-slate-200 pl-5">
                {[...account.interactions]
                  .sort((a, b) => (a.dateInteraction < b.dateInteraction ? 1 : -1))
                  .map((interaction) => (
                    <li key={interaction.id} className="relative">
                      <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-slate-400" />
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium uppercase tracking-wide text-slate-600">
                          {typeInteractionLabel[interaction.type]}
                        </span>
                        <span>·</span>
                        <span>{formatDate(interaction.dateInteraction)}</span>
                        {interaction.creePar && (
                          <>
                            <span>·</span>
                            <span>{interaction.creePar}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900">{interaction.titre}</p>
                      {interaction.description && (
                        <p className="text-sm text-slate-500">{interaction.description}</p>
                      )}
                    </li>
                  ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
