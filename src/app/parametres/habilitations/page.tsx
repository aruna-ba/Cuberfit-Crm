"use client";

import Link from "next/link";
import { useState } from "react";
import { defaultHabilitations, type HabilitationVM } from "@/lib/habilitations";
import { segmentLabel, roleUtilisateurLabel } from "@/lib/labels";
import { Button } from "@/components/ui";
import type { RoleUtilisateur, Segment } from "@/generated/prisma/enums";

const ROLES: RoleUtilisateur[] = [
  "ADMIN",
  "ACTIVATION_MANAGER",
  "SALES_CORPORATE",
  "ACCOUNT_MANAGER",
  "CS_OPS_SUPPORT",
  "LECTURE_SEULE",
];

const SEGMENTS: Segment[] = ["PASSIONNE", "PARTENAIRE", "ENTREPRISE_QVT"];

export default function ParametresHabilitationsPage() {
  const [habilitations, setHabilitations] = useState<HabilitationVM[]>(defaultHabilitations);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function toggle(role: RoleUtilisateur, segment: Segment) {
    setHabilitations((prev) =>
      prev.map((h) => (h.role === role && h.segment === segment ? { ...h, autorise: !h.autorise } : h))
    );
    setSavedMessage(null);
  }

  function handleSave() {
    setSavedMessage(
      "Habilitations mises à jour pour cette session — pas encore persistées : la base de données n'est pas encore branchée."
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2340]">Paramètres — Rôles & habilitations</h1>
        <p className="text-sm text-[#5C6584]">
          Contrôle quels segments chaque rôle peut consulter. Un rôle décoché pour un segment ne le voit
          pas — fermeture par défaut, en particulier pour les comptes Entreprises et les données sensibles
          Bloom.
        </p>
      </div>

      <div className="rounded-lg border border-[#E4E7F5] bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E4E7F5] bg-[#F9FAFE] text-xs uppercase tracking-wide text-[#8891B0]">
            <tr>
              <th className="px-4 py-3 font-medium">Rôle</th>
              {SEGMENTS.map((segment) => (
                <th key={segment} className="px-4 py-3 text-center font-medium">
                  {segmentLabel[segment]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF0FC]">
            {ROLES.map((role) => (
              <tr key={role}>
                <td className="px-4 py-3 font-medium text-[#1B2340]">{roleUtilisateurLabel[role]}</td>
                {SEGMENTS.map((segment) => {
                  const habilitation = habilitations.find((h) => h.role === role && h.segment === segment);
                  const autorise = habilitation?.autorise ?? false;
                  return (
                    <td key={segment} className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggle(role, segment)}
                        aria-pressed={autorise}
                        className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          autorise ? "bg-[#3333CE]" : "bg-[#E4E7F5]"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            autorise ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={handleSave}>Enregistrer les habilitations</Button>
        {savedMessage && <span className="text-sm text-emerald-600">{savedMessage}</span>}
      </div>

      <p className="mt-6 text-xs text-[#8891B0]">
        Aucune authentification n&apos;est encore branchée sur ce CRM : cette table ne peut pas encore être
        appliquée à un utilisateur connecté réel. La page{" "}
        <Link href="/comptes" className="text-[#3333CE] hover:underline">
          Comptes
        </Link>{" "}
        propose un sélecteur &laquo;&nbsp;Voir en tant que&nbsp;&raquo; qui simule ce filtrage pour valider la
        configuration avant que l&apos;auth ne soit branchée.
      </p>
    </div>
  );
}
