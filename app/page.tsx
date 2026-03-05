"use client";

import { useState, useMemo, useCallback } from "react";
import { COMPOUNDS } from "@/lib/compounds";
import { calculateBloodLevels } from "@/lib/math";
import CycleChart from "@/components/CycleChart";

function useNumericInput(initial: number, min: number, max: number) {
  const [raw, setRaw] = useState<string>(String(initial));

  const value = useMemo(() => {
    const n = Number(raw);
    if (raw === "" || isNaN(n)) return min;
    return Math.min(max, Math.max(min, n));
  }, [raw, min, max]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
  }, []);

  const onBlur = useCallback(() => {
    setRaw(String(value));
  }, [value]);

  return { raw, value, onChange, onBlur };
}

export default function Home() {
  const [compoundId, setCompoundId] = useState<string>(COMPOUNDS[1].id);
  const doseInput = useNumericInput(250, 1, 10000);
  const frequencyInput = useNumericInput(3, 1, 365);
  const totalDaysInput = useNumericInput(70, 7, 365);

  const dose = doseInput.value;
  const frequency = frequencyInput.value;
  const totalDays = totalDaysInput.value;

  const selectedCompound = COMPOUNDS.find((c) => c.id === compoundId)!;

  const data = useMemo(
    () =>
      calculateBloodLevels(
        dose,
        selectedCompound.halfLife,
        frequency,
        totalDays,
      ),
    [dose, selectedCompound.halfLife, frequency, totalDays],
  );

  const peakLevel = useMemo(
    () => Math.max(...data.map((d) => d.level), 0),
    [data],
  );

  const troughLevel = useMemo(() => {
    const lastInjectionDay =
      Math.floor((totalDays - 1) / frequency) * frequency;
    const nextInjection = lastInjectionDay + frequency;
    const troughDay = Math.min(nextInjection - 1, totalDays - 1);
    return data[troughDay]?.level ?? 0;
  }, [data, totalDays, frequency]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-[#ccff00]/20">
      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-[#ccff00]" />
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Onyx Genetics <span className="text-gray-600">|</span> Research
              &amp; Consulting
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            System Online
          </div>
        </header>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Compound Pharmacokinetics
            <span className="text-[#ccff00]"> Simulator</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Exponential decay model &mdash; single compound blood level tracking
          </p>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Controls */}
          <div className="space-y-5">
            <div className="rounded-lg border border-gray-800 bg-[#111] p-5 space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">
                Parameters
              </h2>

              {/* Compound select */}
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Compound
                </label>
                <select
                  value={compoundId}
                  onChange={(e) => setCompoundId(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ccff00]/50"
                >
                  {COMPOUNDS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dose */}
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Dose per injection (mg)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={1}
                  value={doseInput.raw}
                  onChange={doseInput.onChange}
                  onBlur={doseInput.onBlur}
                  className="w-full rounded border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ccff00]/50"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Injection frequency (every X days)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={1}
                  value={frequencyInput.raw}
                  onChange={frequencyInput.onChange}
                  onBlur={frequencyInput.onBlur}
                  className="w-full rounded border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ccff00]/50"
                />
              </div>

              {/* Total days */}
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Tracking period (days)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={7}
                  max={365}
                  value={totalDaysInput.raw}
                  onChange={totalDaysInput.onChange}
                  onBlur={totalDaysInput.onBlur}
                  className="w-full rounded border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ccff00]/50"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-800 bg-[#111] p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Peak
                </p>
                <p className="mt-1 text-lg font-bold text-[#ccff00]">
                  {peakLevel.toFixed(1)}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    mg
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-[#111] p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Trough
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {troughLevel.toFixed(1)}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    mg
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-[#111] p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Half-life
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {selectedCompound.halfLife}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    days
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-[#111] p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Injections
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {Math.floor((totalDays - 1) / frequency) + 1}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    total
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex flex-col rounded-lg border border-gray-800 bg-[#111] p-5">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Blood Concentration Over Time
            </h2>
            <div className="min-h-[350px] flex-1">
              <CycleChart data={data} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-800 bg-[#111] p-6 sm:flex-row">
          <p className="text-sm text-gray-400">
            Require protocol consulting or research equipment logistics?
          </p>
          <a
            href="#contact"
            className="shrink-0 rounded bg-[#ccff00] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#b8e600] active:scale-[0.98]"
          >
            Contact Logistics
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-gray-800 pt-4 text-center text-[10px] text-gray-600 uppercase tracking-widest">
          Onyx Genetics &copy; {new Date().getFullYear()} &mdash; For Research
          Purposes Only
        </footer>
      </div>
    </div>
  );
}
