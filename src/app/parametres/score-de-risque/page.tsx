"use client";

import { useMemo, useState } from "react";
import { defaultPonderations, type PonderationVM } from "@/lib/ponderations";
import { segmentLabel, critereRisqueScoreLabel } from "@/lib/labels";
import { Button } from "@/components/ui";
import type { Segment } from "@/generated/prisma/enums";

const SEGMENTS: Segment[] = ["PASSIONNE", "PARTENAIRE", "ENTREPRISE_QVT"];

function SegmentCard({
  segment,
  ponderations,
  onChange,
}: {
  segment: Segment;
  ponderations: PonderationVM[];
  onChange: (id: string, poidsPct: number) => void;
}) {
  const total = ponderations.reduce((sum, p) => sum + p.poidsPct, 0);
  const isValid = total === 100;

  return (
    <div className="rounded-xl border border-[#E4E7F5] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#1B2340]">{segmentLabel[segment]}</h2>
        <span className={`text-sm font-medium ${isValid ? "text-emerald-600" : "text-red-600"}`}>
          Total : {total}% {isValid ? "✓" : "— doit valoir 100%"}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {ponderations.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <label htmlFor={p.id} className="flex-1 text-sm text-[#5C6584]">
              {critereRisqueScoreLabel[p.critere]}
            </label>
            <input
              id={p.id}
              type="number"
              min={0}
              max={100}
              value={p.poidsPct}
              onChange={(e) => onChange(p.id, Number(e.target.value))}
              className="w-20 rounded-lg border border-[#E4E7F5] px-2 py-1 text-right text-sm focus:border-[#3333CE] focus:outline-none focus:ring-1 focus:ring-[#3333CE]"
            />
            <span className="w-4 text-sm text-[#8891B0]">%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ParametresScoreDeRisquePage() {
  const [ponderations, setPonderations] = useState<PonderationVM[]>(defaultPonderations);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const bySegment = useMemo(() => {
    const map = new Map<Segment, PonderationVM[]>();
    for (const segment of SEGMENTS) {
      map.set(segment, ponderations.filter((p) => p.segment === segment));
    }
    return map;
  }, [ponderations]);

  function handleChange(id: string, poidsPct: number) {
    setPonderations((prev) => prev.map((p) => (p.id === id ? { ...p, poidsPct } : p)));
    setSavedMessage(null);
  }

  function handleSave() {
    setSavedMessage(
      "Pondérations mises à jour pour cette session — pas encore persistées : la base de données n'est pas encore branchée."
    );
  }

  const allValid = SEGMENTS.every(
    (segment) => (bySegment.get(segment) ?? []).reduce((sum, p) => sum + p.poidsPct, 0) === 100
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B2340]">Paramètres — Score de risque</h1>
        <p className="text-sm text-[#5C6584]">
          Ajuste les pondérations par segment sans redéploiement. Les seuils (Vert 70-100 · Orange
          40-69 · Rouge 0-39) restent fixes.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {SEGMENTS.map((segment) => (
          <SegmentCard
            key={segment}
            segment={segment}
            ponderations={bySegment.get(segment) ?? []}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={handleSave} disabled={!allValid}>
          Enregistrer les pondérations
        </Button>
        {!allValid && (
          <span className="text-sm text-red-600">
            Chaque segment doit totaliser 100% avant de pouvoir enregistrer.
          </span>
        )}
        {savedMessage && <span className="text-sm text-emerald-600">{savedMessage}</span>}
      </div>
    </div>
  );
}
